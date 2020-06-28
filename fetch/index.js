const axios = require('axios');
const log4js = require('../config/log');
const logger = log4js.getLogger(process.env.NODE_ENV || 'prod');
const cheerio = require('cheerio');
const qs = require('qs');
const uuid = require('node-uuid');

const s = 1000
const PHPSESSID = uuid.v1();

// create an axios' instance
const instance = axios.create({
  // use process.env.BASE_API
  baseURL: 'http://qxd.gunpi.cn',
  timeout: 10 * s
})

instance.defaults.headers['Cookie'] = 'PHPSESSID=' + PHPSESSID;
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

const getLinksFullByName = (name, html) => {
  let document = cheerio.load(html);
  let hyperLinks = document('a');
  let resultUrl = null;
  hyperLinks.toArray().filter(hyperLink => {
    if (hyperLink.children[0].data == name) {
      resultUrl = hyperLink.attribs.href;
    }
  });
  return resultUrl;
};

const MARKBOOK_TITLE = '书签';
const RETURN_HREF = '返回游戏';
const TOO_FAST_TITLE = '【群雄斗】点击太快了！！';
const IP_BIND_MSG = '请勿频繁登录帐号';

const get = async (url) => {
  return await instance.get(url).then(async (response) => {
    let DOM = cheerio.load(response);
    if (DOM('title').text() == MARKBOOK_TITLE) {
      response = await get(getLinksFullByName(RETURN_HREF, response));
    }
    if (DOM('title').text() == TOO_FAST_TITLE) {
      response = await get(url);
    }
    if (DOM.text().includes(IP_BIND_MSG)) {
      logger.error(IP_BIND_MSG)
    }
    return response;
  }).catch((err) => {
    logger.error(err);
    return null;
  })
}

const post = async (data, url) => {
  logger.info('data: ', qs.stringify(data));
  return await instance.post(url, qs.stringify(data)).then(async (response) => {
    let DOM = cheerio.load(response);
    if (DOM('title').text() == MARKBOOK_TITLE) {
      response = await get(getLinksFullByName(RETURN_HREF, response));
    }
    if (DOM('title').text() == TOO_FAST_TITLE) {
      response = await post(url, qs.stringify(data));
    }
    if (DOM.text().includes(IP_BIND_MSG)) {
      logger.error(IP_BIND_MSG)
    }
    return response;
  })

}

module.exports = {
  get: get,
  post: post,
  instance: instance
}
