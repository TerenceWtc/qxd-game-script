const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const present = async (html) => {
    logger.info(`account: ${global.qxd.name}, function present start`);
    let text; let label; let url;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.BREAK_TEXT_PRESENT)) {
            break;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_PRESENT_REGEX, html, undefined, true);
        if (!url) {
            [label, url] = bizUtil.getLabelAndURL(config.ARRAY_PRESENT, html);
        }
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function present end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    present,
};
