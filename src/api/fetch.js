const axios = require('axios');
const uuid = require('uuid');

const logger = require('../log');

const s = 1000;
const PHPSESSID = uuid.v1();

// create an axios' instance
const instance = axios.create({
    // use process.env.BASE_API
    baseURL: 'http://qxd.gunpi.cn',
    timeout: 10 * 60 * s,
});

instance.defaults.headers.Cookie = `PHPSESSID=${PHPSESSID}`;
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// request interceptor
instance.interceptors.request.use((config) => {
    config.headers['x-forwarded-for'] = global.qxd.ip;
    return config;
}, (error) => {
    logger.error(`request error: ${error}`);
    Promise.reject(error);
});

// response interceptor
instance.interceptors.response.use(
    (response) => {
        const { data, status } = response;
        if (status !== 200) {
            logger.error(`response status: ${status}`);
            return Promise.reject(new Error(data.message));
        }
        return data;
    },
    (error) => {
        logger.error('response error: ', error);
        return Promise.reject(error.code);
        // return error.code
    },
);

module.exports = {
    instance,
};
