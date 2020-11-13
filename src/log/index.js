const log4js = require('log4js');

log4js.configure(
    {
        appenders: {
            fileLog: {
                type: 'file',
                filename: `${process.cwd()}/logs/log`,
                pattern: 'yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                encoding: 'utf-8',
                // 10 * 1024 * 1024
                maxLogSize: 10485760,
            },
            console: {
                type: 'console',
            },
        },
        categories: {
            prod: {
                appenders: ['fileLog', 'console'],
                level: 'info',
            },
            default: {
                appenders: ['fileLog', 'console'],
                level: 'debug',
            },
        },
    },
);

const logger = log4js.getLogger(process.env.NODE_ENV || 'default');

module.exports = logger;
