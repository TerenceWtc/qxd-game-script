const fetchApi = require('../api');
const config = require('../config');
const { bizHelper } = require('../helper');
const { commonEvent, escortEvent } = require('./sub-event');
const { logoutSerivce } = require('./sub-service');
const { bizUtil, cryptoUtil, dbUtil } = require('../utils');

const event = async (req) => {
    req.logger.debug('event');

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

        // // 每日合成福利
        // html = await commonEvent.common(html, config.ARRAY_EVENT_12[1], config.FLAG_LOOP, config.ARRAY_EVENT_12);
        // 过关斩将
        html = await commonEvent.common(html, config.ARRAY_EVENT_13[1], config.FLAG_LOOP, config.ARRAY_EVENT_13);
        // 积分乐园
        html = await commonEvent.common(html, config.ARRAY_EVENT_10[1], config.FLAG_LOOP, config.ARRAY_EVENT_10);
        // 签到领礼包
        html = await commonEvent.common(html, config.ARRAY_EVENT_06[1], config.FLAG_LOOP, config.ARRAY_EVENT_06);
        // 活跃福利
        html = await commonEvent.common(html, config.ARRAY_EVENT_11[1], config.FLAG_LOOP, config.ARRAY_EVENT_11);

        // 合练送抽卡券
        html = await commonEvent.common(html, config.ARRAY_EVENT_15[1], config.FLAG_LOOP, config.ARRAY_EVENT_15);
        // 祈福送良将
        html = await commonEvent.common(html, config.ARRAY_EVENT_08[1], config.FLAG_LOOP, config.ARRAY_EVENT_08);
        // 天梯活动周
        html = await commonEvent.common(html, config.ARRAY_EVENT_09[1], config.FLAG_LOOP, config.ARRAY_EVENT_09);
        // 每日活跃福袋
        html = await commonEvent.common(html, config.ARRAY_EVENT_14[1], config.FLAG_LOOP, config.ARRAY_EVENT_14);

        // 每日运镖
        html = await escortEvent.escort(html);
        // 累计活跃领钻券
        html = await commonEvent.common(html, config.ARRAY_EVENT_04[1], config.FLAG_LOOP, config.ARRAY_EVENT_04);
        // 英雄酒馆
        html = await commonEvent.common(html, config.ARRAY_EVENT_01[1], config.FLAG_LOOP, config.ARRAY_EVENT_01);
        // 答题得合成卡
        html = await commonEvent.common(html, config.ARRAY_EVENT_02[1], config.FLAG_LOOP, config.ARRAY_EVENT_02);
        // 江湖客栈
        html = await commonEvent.common(html, config.ARRAY_EVENT_03[1], config.FLAG_LOOP, config.ARRAY_EVENT_03);
        // 江湖赏金令
        html = await commonEvent.common(html, config.ARRAY_EVENT_PASS[1], config.FLAG_LOOP, config.ARRAY_EVENT_PASS);
        // 烽火戏诸侯
        html = await commonEvent.common(html, config.ARRAY_EVENT_FENGHUO[1], config.FLAG_LOOP, config.ARRAY_EVENT_FENGHUO);
        await logoutSerivce.logout(html);
        global.qxd = {};
        await dbUtil.exectue(`update account set flag_run = 0 where id = ${accounts[accountIndex].id}`);
    }
    await dbUtil.exectue(`update service set flag_run = 0 where owner = ${id}`);
};

module.exports = {
    event,
};
