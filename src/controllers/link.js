const moment = require('moment')
const crypto = require('crypto');

module.exports.generateLink = async (req, res, next) => {
    const { _id } = req.body;
    try {
        const date = moment().format('YYYY-MM-DD:hh:mm:ss');
        let rawURL = _id + date + process.env.CRYPTO_KEY_SECRET;
        let hashedURL = crypto.createHash('md5').update(rawURL).digest('hex');

        url = req.protocol + '://' + req.headers.host + '/link/view/' + hashedURL;
        req.body._url = url;
        req.body._url_hash = hashedURL;
        req.body.activateURL = 1;

        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({ "status": false, "result": "Oops, an error occured!" });
    }
}