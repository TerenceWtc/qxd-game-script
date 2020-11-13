/* eslint-disable import/no-dynamic-require */

const env = process.env.NODE_ENV || 'dev';
const envConfig = require(`./config/${env}.json`);
const constantConfig = require('./config/constant.json');
const settingsConfig = require('./config/settings.json');
const bankConfig = require('./config/bank.json');

const config = {
    port: 3001,
    errorCode: {
        COMMON_400: 'E401 Bad Reqeust',
        COMMON_500: 'E501 Server Internal Error',
        DB: 'E502 DB Error',
    },
    ...envConfig,
    ...constantConfig,
    ...settingsConfig,
    ...bankConfig,
};

module.exports = config;
