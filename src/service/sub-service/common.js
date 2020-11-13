const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const common = async (html, functionName, loop, breakText, array) => {
    logger.info(`account: ${global.qxd.name}, function ${functionName} start`);
    let text; let label; let url;
    while (loop) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(breakText)) {
            break;
        }
        [label, url] = bizUtil.getLabelAndURL(array, html);
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
