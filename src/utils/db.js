const config = require('../config');
const logger = require('../log');
const mysql = require('../mysql');

const errorCode = config.errorCode.DB;
const connection = mysql.connection;

const exectue = (sql) => new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
        if (err) {
            logger.error(`${errorCode}, ${err}`);
            reject(err);
        } else {
            resolve(rows);
        }
    });
});

module.exports = {
    exectue,
};
