const cheerio = require('cheerio');
const fetch = require('../fetch');

const MAIN_PAGE = '主页';
const regex = '(\(\d+\+?\))?';

const html2DOM = (html) => {
  return cheerio.load(html);
}

const getLinksByName = (name, html) => {
  let document = html2DOM(html);
  let hyperLinks = document('a');
  let resultUrl = hyperLinks.toArray().slice(0, -4).find(hyperLink => {
    return hyperLink.children[0].data == name;
  });
  if (resultUrl != undefined) {
    return resultUrl.attribs.href;
  }
  return null
};

const getFullLinksByName = (name, html) => {
  let document = html2DOM(html);
  let hyperLinks = document('a');
  let resultUrl = hyperLinks.toArray().find(hyperLink => {
    return hyperLink.children[0].data == name;
  });
  if (resultUrl != undefined) {
    return resultUrl.attribs.href;
  }
  return null
};

const getLinksByNameAndReg = (name, html) => {
  name = `/${name}${regex}/`
  let document = html2DOM(html);
  let hyperLinks = document('a');
  let resultUrl = hyperLinks.toArray().slice(0, -4).find(hyperLink => {
    return hyperLink.children[0].data == name;
  });
  if (resultUrl != undefined) {
    return resultUrl.attribs.href;
  }
  return null
};

const getFirstLink = (html) => {
  let document = html2DOM(html);
  let hyperLinks = document('a');
  let result = hyperLinks.toArray().shift()
  return [result.children[0].data, result.attribs.href];
};

const click = async (name, url, req) => {
  if (url) {
    req.logger.info(`account: ${req.account}, click: ${name}, url: ${url}`);
    let html = await fetch.get(url);
    return html;
  }
  return null;
}

const post = async (data, url, req) => {
  if (url) {
    req.logger.info(`account: ${req.account}, post: ${data}, url: ${url}`);
    let html = await fetch.post(data, url);
    return html;
  }
  return null;
}

const backToMainPage = async (html, req) => {
  link = getLinksByName(MAIN_PAGE, html);
  if (!link) {
    return html;
  }
  return await click(MAIN_PAGE, link, req);
}

const getAccountName = (html) => {
  let DOM = html2DOM(html);
  let text = DOM.text();
  let account = 'Unknown';
  if (text.includes('[MM]')) {
    account = text.split('[MM]')[1].split('(')[0];
  } else if (text.includes('[GG]')) {
    account = text.split('[GG]')[1].split('(')[0];
  }
  return account;
}

const randomIP = () => {
  let ip = [];
  for (let i = 0; i < 4; i++) {
    ip.push(Math.floor(Math.random() * 254 + 2));
  }
  return ip.join('.')
}

module.exports = {
  html2DOM,
  getLinksByName,
  getFullLinksByName,
  getLinksByNameAndReg,
  getFirstLink,
  click,
  post,
  backToMainPage,
  getAccountName,
  randomIP
}