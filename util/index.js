/*global process*/
const cheerio = require('cheerio');
const bmob = require('../bmob');
const config = require('../config');
const fetch = require('../fetch');
const log4js = require('../config/log');
const logger = log4js.getLogger(process.env.NODE_ENV || 'default');

const convertHtml = (html, isDOM = false) => {
  let document;
  try {
    document = cheerio.load(html);
  } catch (error) {
    logger.error(`convertHtml error: ${error.message}, html content: ${html}`);
    document = cheerio.load(config.constant.TEMPLATE_EMPTY_HTML);
  }
  return isDOM ? document : document.text();
}

const getLinksByName = (name, html, isFull, isReg, isBold) => {
  let document = convertHtml(html, true);
  let hyperLinks = document('a');
  let resultUrl;
  hyperLinks = isFull ? hyperLinks.toArray() : hyperLinks.toArray().slice(0, -4);
  if (isReg) {
    let nameReg = new RegExp(`${name}`, 'g');
    resultUrl = hyperLinks.find(hyperLink => {
      return nameReg.test(hyperLink.children[0].data);
    });
  } else {
    resultUrl = hyperLinks.find(hyperLink => {
      if (isBold && hyperLink.children[0].children) {
        return hyperLink.children[0].children[0].data == name;
      } else {
        return hyperLink.children[0].data == name;
      }
    });
  }
  return resultUrl ? resultUrl.attribs.href : false;
};

const getLabelAndURL = (labelArray, html, isFull = false, isReg = false, isBold = false) => {
  let label, url;
  label = labelArray.find(arr => {
    url = getLinksByName(arr, html, isFull, isReg, isBold);
    return url;
  });
  return [label, url];
}

const getFirstLink = (html) => {
  let document = convertHtml(html, true);
  let hyperLinks = document('a');
  let result = hyperLinks.toArray().shift()
  return [result.children[0].data, result.attribs.href];
};

const getInstance = async (url, req) => {
  return await fetch.instance.get(url).then(async (response) => {
    let DOM = convertHtml(response, true);
    if (DOM('title').text() == config.constant.TITLE_BOOKMARK) {
      response = await fetch.instance.get(getLinksByName(config.constant.TEXT_RETURN_GAME, response, true));
    }
    if (DOM('title').text() == config.constant.TITLE_TOO_FAST) {
      response = await await click(config.constant.LABEL_MAIN_PAGE, global.mainPageLink, req);
    }
    if (DOM.text().includes(config.constant.TEXT_IP_BIND)) {
      logger.error(config.constant.TEXT_IP_BIND)
    }
    return response;
  }).catch((err) => {
    logger.error('get request error:', err);
    return null;
  })
}

const postInstance = async (data, url, req) => {
  return await fetch.instance.post(url, data).then(async (response) => {
    let DOM = convertHtml(response, true);
    if (DOM('title').text() == config.constant.TITLE_BOOKMARK) {
      response = await getInstance(getLinksByName(config.constant.TEXT_RETURN_GAME, response, true));
    }
    if (DOM('title').text() == config.constant.TITLE_TOO_FAST) {
      response = await await click(config.constant.LABEL_MAIN_PAGE, global.mainPageLink, req);
    }
    if (DOM.text().includes(config.constant.TEXT_IP_BIND)) {
      logger.error(config.constant.TEXT_IP_BIND)
    }
    return response;
  }).catch((err) => {
    logger.error('post request error:', err);
    return null;
  })

}

const click = async (name, url, req) => {
  if (name == '攻击') {
    await wait();
  }
  if (url) {
    logger.info(`account: ${req.account}, click: ${name}`);
    let html = await getInstance(url, req);
    return html;
  }
  logger.error(`account: ${req.account}, click: ${name}, url: ${url} not found`);
  return null;
}

const post = async (data, url, req) => {
  if (url) {
    req.logger.info(`account: ${req.account}, post: ${data}`);
    let html = await postInstance(data, url, req);
    return html;
  }
  logger.error(`account: ${req.account}, post: ${data}, url: ${url} not found`);
  return null;
}

const backToMainPage = async (req) => {
  return await click(config.constant.LABEL_MAIN_PAGE, global.mainPageLink, req);
}

const getAccountName = (html) => {
  let text = convertHtml(html);
  let account = 'Unknown';
  if (text.includes('[MM]')) {
    account = text.split('[MM]')[1].split('(')[0];
  } else if (text.includes('[GG]')) {
    account = text.split('[GG]')[1].split('(')[0];
  }
  return account;
}

const getMainPage = async (html, req) => {
  let characterURL, mainPageURL, text;
  characterURL = getLinksByName(config.constant.LABEL_CHARACTER, html, undefined, undefined, true);
  html = await click(config.constant.LABEL_CHARACTER, characterURL, req);
  text = convertHtml(html);
  if (text.includes('ID')) {
    req.accountId = /ID:\d+/.exec(text)[0];
  }
  await bmob.saveBmob(req);
  mainPageURL = getLinksByName(config.constant.LABEL_MAIN_PAGE, html);
  if (!mainPageURL) {
    req.logger.error(`account ${req.account} can not find main page`);
  }
  return mainPageURL;
}

const randomIP = () => {
  let ip = [];
  for (let i = 0; i < 4; i++) {
    ip.push(Math.floor(Math.random() * 254 + 2));
  }
  return ip.join('.');
}

const checkVersion = async (version) => {
  return  await bmob.findBmob('version', 'version', version);
}

const wait = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {resolve()}, 200);
  })
}

module.exports = {
  convertHtml,
  getLinksByName,
  getLabelAndURL,
  getFirstLink,
  getInstance,
  click,
  post,
  backToMainPage,
  getAccountName,
  getMainPage,
  randomIP,
  checkVersion,
  wait
}