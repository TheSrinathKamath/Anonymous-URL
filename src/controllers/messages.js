const con = require('../database/index');
const DateDiff = require('../helpers/date-time');
const Messages = require('../models/messages');

module.exports.addLinkToUser = async (req, res) => {
    const { _id, interval, message, _url, _url_hash, activateURL } = req.body;
    const conn = await con.getConnection();
    try {
        await conn.beginTransaction();
        const data = await Messages.addLink(conn, _id, message, interval, _url_hash, activateURL)
        await conn.commit();

        if (!data) return res.status(200).json({ "status": false, "result": "Insertion failed!" });;
        res.status(200).json({ "status": true, "result": _url });
    } catch (error) {
        console.log(error);
        await conn.rollback();
        res.status(500).json({ "status": false, "result": "Error occured. Insertion failed!" })
    } finally {
        await conn.release();
    }
}

module.exports.checkFirstViewed = async (req, res, next) => {
    const { _id } = req.body;
    const { messageHash } = req.params;
    try {
        let response = await Messages.getFirstViewedDate(1, messageHash); //_id is replaced by 1 for dev purposes only

        if (!response.status) return res.redirect('/404')
        if (!response.data.firstViewedOn) {
            const updateStatus = await updateFirstViewedDate(1, messageHash);
            response = await Messages.getFirstViewedDate(1, messageHash); //_id is replaced by 1 for dev purposes only
        }

        req.body.firstViewedOn = response.data.firstViewedOn;
        req.body.timeOut = response.data.timeOut;
        next();
    } catch (error) {
        console.log(error);
        res.render('error', { err: error })
    }
}

const updateFirstViewedDate = async (_id, messageHash) => {
    const conn = await con.getConnection();
    try {
        await conn.beginTransaction();
        const response = await Messages.updateFirstViewedDate(conn, _id, messageHash);
        await conn.commit();
        if (!response) return false;
        return true;
    } catch (error) {
        await conn.rollback();
        return false;
    } finally {
        conn.release();
    }
}

module.exports.incrementViewCount = async (req, res, next) => {
    const { _id } = req.body;
    const { messageHash } = req.params;
    const conn = await con.getConnection();

    try {
        await conn.beginTransaction();
        const response = Messages.updateViewCount(conn, 1, messageHash);
        await conn.commit();
        if (!response) return res.render('error', { err: response });
        next();
    } catch (error) {
        await conn.rollback();
    } finally {
        conn.release();
    }
}

module.exports.checkLinkValidity = async (req, res, next) => {
    const { _id, timeOut, firstViewedOn, } = req.body;
    const { messageHash } = req.params;
    try {
        const first_viewed_on_date = new Date(firstViewedOn);
        const current_date = new Date();

        const isLinkValid = DateDiff.inSeconds(first_viewed_on_date, current_date) - timeOut > 0 ? false : true;

        if (!isLinkValid) {
            await deleteMessage(1, messageHash);
            return res.redirect('/404')
        }
        next()
    } catch (error) {
        console.log(error);
        res.redirect('/404')
    }
}
const deleteMessage = async (_id, messageHash) => {
    const conn = await con.getConnection();
    try {
        await conn.beginTransaction();
        const response = await Messages.deleteMessage(conn, 1, messageHash);
        await conn.commit();
        return true;
    } catch (error) {
        console.log(error);
        await conn.rollback()
        return false;
    } finally {
        conn.release();
    }
}
module.exports.getMessage = async (req, res) => {
    const { _id } = req.body;
    const { messageHash } = req.params;
    try {
        const response = await Messages.getMessage(1, messageHash, 1);

        if (!response.text) { return res.redirect('/404') }

        const currentDate = new Date();
        const firstViewedOn = new Date(response.firstViewedOn);
        firstViewedOn.setSeconds(firstViewedOn.getSeconds() + response.timeOut);
        const timeDiff = Math.abs(DateDiff.inSeconds(currentDate, firstViewedOn));

        res.render('message', { title: "Shhh... Your secret message.", data: response, timeDiff: timeDiff });
    } catch (error) {
        console.log(error)
        res.status(500).json({ "status": false, "result": "Oops, an error occured" })
    }
}
