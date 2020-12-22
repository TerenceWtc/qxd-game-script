const fs = require('fs');

const fetchApi = require('../api');
const config = require('../config');
const { bizHelper } = require('../helper');
const {
    benefitService, choiceService, commonService, drawService,
    instanceZonesService, logoutSerivce, remainsService,
    saveMoneyService, sellService, strongHoldService,
} = require('./sub-service');
const { bizUtil, cryptoUtil, dbUtil } = require('../utils');

const mission = async (req) => {
    req.logger.debug('mission');

    global.qxd = {};

    const id = cryptoUtil.decrypt(req.params.id);
    await dbUtil.exectue(`update service set flag_run = 1 where owner = ${id}`);
    // query all accounts
    const accounts = await bizHelper.queryAllAccounts(id);

    for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
        // generate IP
        global.qxd.ip = bizUtil.randomIP();

        // login
        let html = await fetchApi.getApi(accounts[accountIndex].url);

        // new check
        global.qxd.name = await bizHelper.newCheck(accounts[accountIndex], html);

        req.logger.info(`IP: ${global.qxd.ip}, account: ${global.qxd.name}`);
        await dbUtil.exectue(`update account set flag_run = 1 where id = ${accounts[accountIndex].id}`);

        // store main page
        global.qxd.mainPageLink = await bizHelper.getMainPage(html);

        html = await commonService.common(html, 'explore', config.FLAG_LOOP, config.BREAK_TEXT_EXPLORE, config.ARRAY_EXPLORE);
        html = await benefitService.benefit(html);
        html = await commonService.common(html, 'stonehenge', config.FLAG_LOOP, config.BREAK_TEXT_NONE, config.ARRAY_STONEHENGE);
        html = await commonService.common(html, 'ladder', config.FLAG_LOOP, config.BREAK_TEXT_LADDER, config.ARRAY_LADDER);
        html = await commonService.common(html, 'arena', config.FLAG_LOOP, config.BREAK_TEXT_ARENA, config.ARRAY_ARENA);
        html = await commonService.common(html, 'training', config.FLAG_LOOP, config.BREAK_TEXT_NONE, config.ARRAY_TRAINING);
        html = await choiceService.choice(html);
        html = await remainsService.remainsMission(html);
        html = await instanceZonesService.instanceZones1(html);
        html = await instanceZonesService.instanceZones2(html);
        html = await drawService.draw(html);
        html = await commonService.common(html, 'friend-point', config.FLAG_LOOP, config.BREAK_TEXT_NONE, config.ARRAY_FRIEND_POINT);
        html = await commonService.common(html, 'mission', config.FLAG_LOOP, config.BREAK_TEXT_NONE, config.ARRAY_MISSION);
        html = await commonService.common(html, 'zb', config.FLAG_LOOP, config.BREAK_TEXT_NONE, config.ARRAY_zb);
        html = await strongHoldService.strongHold(html);

        html = await sellService.sell(html);
        html = await saveMoneyService.saveMoney(html);
        html = await sellService.statistics(html);

        await bizHelper.updateAssets(accounts[accountIndex], html);
        await logoutSerivce.logout(html);
        global.qxd = {};
        await dbUtil.exectue(`update account set flag_run = 0 where id = ${accounts[accountIndex].id}`);
    }

    fs.writeFileSync('skill.json', JSON.stringify(global.skill, null, 4));
    global.skill = undefined;
    await dbUtil.exectue(`update service set flag_run = 0 where owner = ${id}`);
};

const statistics = (req, res) => {
    req.logger.debug('statistics');
    res.status(200);
    res.json(JSON.parse(fs.readFileSync('skill.json')));
};

module.exports = {
    mission,
    statistics,
};
