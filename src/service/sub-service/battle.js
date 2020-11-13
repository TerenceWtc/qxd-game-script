const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const battle = async (html, uid) => {
    logger.info(`account: ${global.qxd.name}, function battle start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url;
    while (config.FLAG_LOOP) {
        if (text.includes(config.BREAK_TEXT_BATTLE_COUNT) || text.includes(config.BREAK_TEXT_BATTLE)) {
            break;
        }
        if (text.includes(config.TEXT_BATTLE_PLAYER_ID)) {
            const regex = new RegExp(config.REGEX_NAME, 'g');
            const match = text.match(regex);
            if (match.length > 1) {
                const form = DOM('form')[0];
                url = `${form.attribs.action}&user_id=${uid}`;
                html = await apiUtil.postUrl('', url);
                DOM = cheerioUtil.convertHtml(html, true);
                text = DOM.text();
                continue;
            }
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_BATTLE, html, undefined, true);
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function battle end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    battle,
};
