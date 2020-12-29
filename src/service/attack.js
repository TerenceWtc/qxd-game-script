const fetchApi = require('../api');
const { bizHelper } = require('../helper');
const {
    battleService, donateService, logoutSerivce,
    presentService, saveMoneyService, sellService,
} = require('./sub-service');
const { bizUtil, cryptoUtil, dbUtil } = require('../utils');

const attack = async (req) => {
    req.logger.debug('attack');

    global.qxd = {};

    const id = cryptoUtil.decrypt(req.params.id);
    const uid = req.params.uid;
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

        html = await presentService.present(html);
        html = await sellService.sell(html);
        if (accounts[accountIndex].id === 102) {
            html = await battleService.battle(html, uid);
        }
        html = await battleService.battle(html, uid);
        html = await saveMoneyService.saveMoney(html);
        // html = await donateService.donate(html);

        await logoutSerivce.logout(html);
        global.qxd = {};
        await dbUtil.exectue(`update account set flag_run = 0 where id = ${accounts[accountIndex].id}`);
    }
    await dbUtil.exectue(`update service set flag_run = 0 where owner = ${id}`);
};

module.exports = {
    attack,
};
