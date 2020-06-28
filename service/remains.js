/**
 * 遗迹
 * Auto attack or repair with full attack point, and recover attack point.
 */
const fetch = require('../fetch');
const util = require('../util');
const sub = require('./sub-service');

const remains = async (url, req, res) => {
  req.logger.info('start remains');
  
  // login
  let html = await fetch.get(url);
  req.account = util.getAccountName(html);

  html = await sub.subRemains.remainsFull(html, req);

  // res.status(200);
  // res.send('ok');
}

module.exports = {
  remains
}