const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const draw = async (html) => {
    logger.info(`account: ${global.qxd.name}, function draw start`);
    let text; let label; let url;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.TEXT_FREE_DRAW)) {
            url = bizUtil.getLinksByName(config.LABEL_FREE_DRAW, html);
            html = await apiUtil.getUrl(config.LABEL_FREE_DRAW, url);
            continue;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_DRAW, html);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function draw end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    draw,
};
