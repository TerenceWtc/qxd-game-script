/*global process*/
const axios = require('axios');
const log4js = require('../config/log');
const logger = log4js.getLogger(process.env.NODE_ENV || 'default');
// const cheerio = require('cheerio');
// const qs = require('qs');
const uuid = require('node-uuid');

const s = 1000
const PHPSESSID = uuid.v1();

// create an axios' instance
const instance = axios.create({
  // use process.env.BASE_API
  baseURL: 'http://qxd.gunpi.cn',
  timeout: 10 * 60 * s
})

instance.defaults.headers['Cookie'] = 'PHPSESSID=' + PHPSESSID;
// instance.defaults.headers['Cookie'] = 'PHPSESSID=' + 'ddb1b4e0-b6dd-11ea-b635-f106ad6873fb';
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// request interceptor
instance.interceptors.request.use(async config => {
  config.headers['x-forwarded-for'] = global.ip;
  // logger.debug('request url: ', config.url)
  // logger.debug('request headers: ', config.headers)
  return config
}, error => {
  logger.error('request error: ' + error)
  Promise.reject(error)
})

// response interceptor
instance.interceptors.response.use(
  response => {
    let data = response.data
    let status = response.status
    if (status !== 200) {
      logger.error('response status: ' + status)
      return Promise.reject(new Error(data.message))
    }
    return data
  },
  error => {
    logger.error('response error: ', error.code)
    return Promise.reject(error.code)
    // return error.code
  }
)

module.exports = {
  instance: instance
}
