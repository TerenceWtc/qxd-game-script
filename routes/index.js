var express = require('express');
var router = express.Router();
const config = require('../config').config;
const util = require('../util');
const service = require('../service');

const accounts = config.accounts;
const account = config.account;

router.get('/daily-mission', async (req, res) => {
  req.logger.info('start daliy mission');
  for (let i = 0; i < accounts.length; i++) {
    global.ip = util.randomIP();
    req.logger.info(`IP: ${global.ip}`);
    await service.mission.dailyMission(accounts[i], req, res);
  }
  req.logger.info(`daily mission complete! finish ${accounts.length} accounts.`);
  res.status('200');
  res.send('ok');
})

router.get('/remains', async (req, res) => {
  global.ip = util.randomIP();
  req.logger.info(`IP: ${global.ip}`);
  await service.remains.remains(account, req, res);
  res.status('200');
  res.send('ok');
})

module.exports = router;
