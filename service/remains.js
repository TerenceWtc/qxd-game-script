/**
 * 遗迹
 * Auto attack or repair with full attack point, and recover attack point.
 */
const config = require('../config');
const util = require('../util');
const sub = require('./sub-service');
// 攻击遗迹守护石像
const account = config.settings['遗迹账号'];

const remains = async (req) => {
  req.logger.info('start remains');
  let html;

  // check version
  if (!util.checkVersion()) {
    req.logger.error('Your version is expired, please get the latest one.');
    req.logger.error('版本已过时，请获取最新版');
    return;
  }

  // generate IP
  global.ip = util.randomIP();
  req.logger.info(`IP: ${global.ip}`);
  
  // login
  html = await util.getInstance(account);
  req.account = util.getAccountName(html);

  // store main page
  global.mainPageLink = await util.getMainPage(html, req);

  html = await sub.subRemains.remainsFull(html, req);

  // res.status(200);
  // res.send('ok');
}

module.exports = {
  remains
}