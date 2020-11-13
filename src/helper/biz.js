const config = require('../config');
const logger = require('../log');
const { apiUtil, bizUtil, dbUtil } = require('../utils');

const runningCheck = async (id) => {
    logger.info(`running check for owner: ${id}`);
    const userRunning = await dbUtil.exectue(`select flag_run from service where owner = ${id}`);

    if (userRunning[0].flag_run === 0) {
        return false;
    }

    const accountRunning = await dbUtil.exectue(`select name from account where owner = ${id} and flag_run = 1`);
    return accountRunning[0].name;
};

const queryAllAccounts = async (id) => {
    logger.info(`query all accounts for owner: ${id}`);
    const accounts = await dbUtil.exectue(`select id, url, name, flag_new from account where owner = ${id}`);

    return accounts;
};

const newCheck = async (account, html) => {
    logger.info(`new check for id: ${account.id}`);

    if (account.flag_new === 1) {
        const [label, url] = bizUtil.getLabelAndURL(['角色信息'], html, false, false, true);
        html = await apiUtil.getUrl(label, url);
        const accountInfo = bizUtil.getAccountInfo(html);
        await dbUtil.exectue(`update account set flag_new = 0, name = '${accountInfo.name}', uid = ${accountInfo.uid} where id = ${account.id}`);
        return accountInfo.name;
    }

    return account.name;
};

const backToMainPage = async () => await apiUtil.getUrl(config.LABEL_MAIN_PAGE, global.qxd.mainPageLink);

const updateAssets = async (account, html) => {
    logger.info(`update assets for id: ${account.id}`);
    const accountAssets = bizUtil.getAccountAssets(html);
    // html = backToMainPage();
    const [label, url] = bizUtil.getLabelAndURL(['角色信息'], html, false, false, true);
    html = await apiUtil.getUrl(label, url);
    const accountInfo = bizUtil.getAccountInfo(html);
    await dbUtil.exectue(`update account set bank = ${accountAssets.bank}, friend_point = ${accountAssets.friendPoint}, card_count = '${accountAssets.cardCount}', yubi = ${accountInfo.yubi} where id = ${account.id}`);
};

const getMainPage = async (html) => {
    const characterURL = bizUtil.getLinksByName(config.LABEL_CHARACTER, html, undefined, undefined, true);
    html = await apiUtil.getUrl(config.LABEL_CHARACTER, characterURL);
    const mainPageURL = bizUtil.getLinksByName(config.LABEL_MAIN_PAGE, html);
    if (!mainPageURL) {
        logger.error(`account ${global.qxd.account} can not find main page`);
    }
    return mainPageURL;
};

module.exports = {
    backToMainPage,
    runningCheck,
    queryAllAccounts,
    newCheck,
    updateAssets,
    getMainPage,
};
