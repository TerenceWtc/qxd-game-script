const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, apiUtil } = require('../../utils');

const common = async (html, functionName, loop, array) => {
    logger.info(`account: ${global.qxd.name}, function ${functionName} start`);
    let label; let url;
    let receive = false;
    while (loop) {
        if (receive) {
            receive = false;
            [label, url] = bizUtil.getLabelAndURL(['返回'], html);
            if (!label) {
                html = await bizHelper.backToMainPage();
                continue;
            }
            html = await apiUtil.getUrl(label, url);
            continue;
        }
        [label, url] = bizUtil.getLabelAndURL(array, html);
        receive = label === '领取';
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function ${functionName} end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    common,
};
