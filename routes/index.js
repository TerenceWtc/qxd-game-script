var express = require('express');
var router = express.Router();
const service = require('../service');

router.get('/daily-mission', async (req, res) => {
  await service.mission.dailyMission(req);
  res.status('200');
  res.send('ok');
})

router.get('/remains1', async (req, res) => {
  await service.remains.remains1(req);
  res.status('200');
  res.send('ok');
})

router.get('/remains2', async (req, res) => {
  await service.remains.remains2(req);
  res.status('200');
  res.send('ok');
})

module.exports = router;
