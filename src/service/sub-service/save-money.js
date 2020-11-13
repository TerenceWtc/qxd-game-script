const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const saveMoney = async (html) => {
    logger.info(`account: ${global.qxd.name}, function saveMoney start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url;
    while (config.FLAG_LOOP) {
        if (text.includes(config.TEXT_BANK)) {
            const regex = new RegExp(config.REGEX_MONEY);
            let money = regex.exec(text)[0];
            money = money.split(':')[1];
            if (money < 10000) {
                break;
            }
            money = Math.floor(money / 10000) * 10000;
            const form = DOM('form')[0];
            const data = `money=${money}`;
            url = form.attribs.action;
            html = await apiUtil.postUrl(data, url);
            DOM = cheerioUtil.convertHtml(html, true);
            text = DOM.text();
            continue;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_BANK, html, true);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function saveMoney end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    saveMoney,
};
