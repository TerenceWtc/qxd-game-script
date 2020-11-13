const config = require('../../config');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const logout = async (html) => {
    logger.info(`account: ${global.qxd.name}, function logout start`);
    let text; let label; let url;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.BREAK_TEXT_LOGOUT)) {
            break;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_LOGOUT, html, true);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function logout end`);
};

module.exports = {
    logout,
};
