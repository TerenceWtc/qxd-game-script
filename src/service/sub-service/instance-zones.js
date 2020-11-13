const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

// 试炼之塔
const instanceZones1 = async (html) => {
    logger.info(`account: ${global.qxd.name}, function instanceZones_1 start`);
    let text; let label; let url;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.BREAK_TEXT_INSTANCE_ZONE1_DEFEAT)) {
            break;
        }
        if (!text.includes('选择对手') && !text.includes(config.ARRAY_INSTANCE_ZONE1[2]) && text.includes(config.ARRAY_INSTANCE_ZONE1[1]) && text.includes(config.BREAK_TEXT_INSTANCE_ZONE1_COUNT)) {
            break;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_INSTANCE_ZONE1, html);
        if (label == config.ARRAY_CHOICE[3]) {
            break;
        }
        if (!url) {
            [label, url] = bizUtil.getFirstLink(html);
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function instanceZones_1 end`);
    return await bizHelper.backToMainPage();
};

// 过关斩将
const instanceZones2 = async (html) => {
    logger.info(`account: ${global.qxd.name}, function instanceZones_2 start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url;
    while (config.FLAG_LOOP) {
        if (text.includes(config.BREAK_TEXT_INSTANCE_ZONE2_LEVEL)) {
            break;
        }
        if (text.includes(config.BREAK_TEXT_INSTANCE_ZONE2_COUNT) && !bizUtil.getLinksByName(config.ARRAY_INSTANCE_ZONE2[2], html)) {
            break;
        }
        if (text.includes(config.TEXT_INSTANCE_ZONE2_DIFFICULTY)) {
            const personType = DOM('option').length == 1 ? 1 : DOM('option').get(-2).attribs.value;
            const form = DOM('form')[0];
            const data = `person_type=${personType}`;
            url = form.attribs.action;
            html = await apiUtil.postUrl(data, url);
            DOM = cheerioUtil.convertHtml(html, true);
            text = DOM.text();
            continue;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_INSTANCE_ZONE2, html);
        if (label === config.ARRAY_INSTANCE_ZONE2[4]) {
            html = await apiUtil.getUrl(label, url);
            DOM = cheerioUtil.convertHtml(html, true);
            text = DOM.text();
            continue;
        }
        if (!url) {
            [label, url] = bizUtil.getFirstLink(html);
        }
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function instanceZones_2 end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    instanceZones1,
    instanceZones2,
};
