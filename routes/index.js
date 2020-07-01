var express = require('express');
var router = express.Router();
const service = require('../service');
const bmob = require('../bmob');

router.get('/daily-mission', async (req, res) => {
  await service.mission.dailyMission(req);
  res.status('200');
  res.send('ok');
})

router.get('/remains', async (req, res) => {
  await service.remains.remains(req);
  res.status('200');
  res.send('ok');
})

router.get('/bmob', async (req, res) => {
  bmob.getBmob();
  res.status('200');
  res.send('ok');
})

module.exports = router;
