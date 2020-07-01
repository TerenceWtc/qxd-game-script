/**
 * 遗迹
 * Auto attack or repair with full attack point, and recover attack point.
 */
const config = require('../config');
const fetch = require('../fetch');
const util = require('../util');
const sub = require('./sub-service');

const account = config.account['遗迹账号'];

const remains = async (req) => {
  req.logger.info('start remains');
  global.ip = util.randomIP();
  req.logger.info(`IP: ${global.ip}`);
  // login
  let html = await fetch.get(account);
  req.account = util.getAccountName(html);

  html = await sub.subRemains.remainsFull(html, req);

  // res.status(200);
  // res.send('ok');
}

module.exports = {
  remains
}