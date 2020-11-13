const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const donate = async (html) => {
    logger.info(`account: ${global.qxd.name}, function donate start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url;
    while (config.FLAG_LOOP) {
        if (text.includes(config.BREAK_TEXT_DONATE)) {
            break;
        }
        if (text.includes(config.TEXT_DONATE)) {
            const regex = new RegExp(config.REGEX_MONEY);
            let money = regex.exec(text)[0];
            money = money.split(':')[1];
            money = Math.floor(money / 10000000) * 1000;
            const form = DOM('form')[0];
            const data = `donate_number=${money}`;
            url = form.attribs.action;
            html = await apiUtil.postUrl(data, url);
            DOM = cheerioUtil.convertHtml(html, true);
            text = DOM.text();
            continue;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_DONATE, html, true);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function donate end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    donate,
};
