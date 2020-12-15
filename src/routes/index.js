const express = require('express');

const { bizHelper } = require('../helper');
const { eventService, attackService, missionService } = require('../service');
const { cryptoUtil } = require('../utils');

const router = express.Router();

router.get('/health', (req, res) => {
    req.logger.info('health check');
    res.status(200);
    res.send({ message: 'health check' });
});

const preRouter = async (req, res, next) => {
    const id = cryptoUtil.decrypt(req.params.id);
    const runningCheckResult = await bizHelper.runningCheck(id);
    if (runningCheckResult) {
        res.status(200);
        res.send({ message: `${runningCheckResult} is running now!` });
    } else {
        res.status(200);
        res.send({ message: 'start' });
        next();
    }
};

router.get('/attack/:id/:uid', preRouter, attackService.attack);

router.get('/event/:id', preRouter, eventService.event);

router.get('/mission/:id', preRouter, missionService.mission);

router.get('/statistics/:id', missionService.statistics);

module.exports = router;
