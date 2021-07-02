const con = require('../database/index');

module.exports = class Messages {
    constructor() { }

    static async addLink(conn, user_id, message, valid_for_n_secs, message_hash, is_active) {
        const query = "INSERT INTO messages (user_id, message, valid_for_n_secs, message_hash, is_active) VALUES (?, ?, ?, ?, ?);";
        try {
            const [response] = await conn.execute(query, [user_id, message, valid_for_n_secs, message_hash, is_active]);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getMessage(user_id, message_hash, is_active) {
        const query = "SELECT message as text, valid_for_n_secs as timeOut, first_viewed_on as firstViewedOn from messages WHERE user_id = ? AND message_hash = ? AND is_active = ?";
        try {
            const [response] = await con.execute(query, [user_id, message_hash, is_active]);
            return response[0];
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async deleteMessage(conn, user_id, message_hash) {
        const query = "UPDATE messages SET is_active = 0 WHERE user_id = ? AND message_hash = ?";
        try {
            const [response] = await conn.execute(query, [user_id, message_hash]);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async updateViewCount(conn, user_id, message_hash) {
        const query = "UPDATE messages SET m_viewed_count = (m_viewed_count + 1) WHERE user_id = ? AND message_hash = ? AND is_active = 1";
        try {
            const [response] = await conn.execute(query, [user_id, message_hash]);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async updateFirstViewedDate(conn, user_id, message_hash) {
        const query = "UPDATE messages SET first_viewed_on = NOW() WHERE user_id = ? AND message_hash = ? AND is_active = 1";
        try {
            const [response] = await conn.execute(query, [user_id, message_hash]);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getFirstViewedDate(user_id, message_hash) {
        const query = "SELECT first_viewed_on as firstViewedOn, valid_for_n_secs as timeOut, is_active as activeStatus FROM messages WHERE user_id = ? AND message_hash = ?";
        try {
            const [response] = await con.execute(query, [user_id, message_hash]);
            return { "status": response[0].activeStatus, "data": response[0] }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}