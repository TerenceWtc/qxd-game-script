const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const escort = async (html) => {
    logger.info(`account: ${global.qxd.name}, function ${config.ARRAY_EVENT_05[1]} start`);
    let text; let label; let url;
    const array = Array.from(config.ARRAY_EVENT_05);
    let slice = true;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.BREAK_TEXT_EVENT_05_COUNT) || text.includes(config.BREAK_TEXT_EVENT_05_ING)) {
            break;
        }
        if (slice && text.includes(config.TEXT_EVENT_05)) {
            array.splice(3, 1);
            slice = false;
        }
        [label, url] = bizUtil.getLabelAndURL(array, html, false, true);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function ${config.ARRAY_EVENT_05[1]} end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    escort,
};
