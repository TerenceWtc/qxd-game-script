const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

// const { bank } = config;

const choice = async (html) => {
    logger.info(`account: ${global.qxd.name}, function choice start`);
    let text; let label; let url; let question;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.BREAK_TEXT_CHOICE)) {
            break;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_CHOICE, html);
        if (label === config.ARRAY_CHOICE[3]) {
            break;
        }
        if (!url) {
            question = text.split('题:')[1].split('1:')[0];
            [label, url] = bizUtil.getLabelAndURL([config[question]], html);
        }
        if (!url) {
            logger.warn(text);
            [label, url] = bizUtil.getFirstLink(html);
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function choice end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    choice,
};
