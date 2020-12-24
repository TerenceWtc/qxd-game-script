const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const skillList = config.SKILLS;
const priceList = config['价格表'];

const sell = async (html) => {
    logger.info(`account: ${global.qxd.name}, function sell start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url; let sellList = [];
    while (config.FLAG_LOOP) {
        sellList = [];
        if (text.includes('英雄出售')) {
            const cardList = DOM('input');
            for (let i = 0; i < cardList.length - 1; i++) {
                const cardDetail = cardList[i].next.next.next.next.data;
                const cardInfo = {
                    cardValue: cardList[i].attribs.value,
                    cardLevel: cardDetail.split('-')[2],
                    cardSoul: cardDetail.split('-')[3].split('魂')[0],
                    cardSkill: cardDetail.split('-')[4],
                    cardMoney: cardList[i].next.next.next.next.next.children[0].data,
                };
                if (cardInfo.cardLevel === 'lv1') {
                    if (cardInfo.cardSoul < 50 && cardInfo.cardMoney < 3000) {
                        if (!skillList.includes(cardInfo.cardSkill)) {
                            sellList.push(`card_id%5B%5D=${cardInfo.cardValue}`);
                        }
                    }
                } else if (cardInfo.cardSoul !== '600') {
                    sellList.push(`card_id%5B%5D=${cardInfo.cardValue}`);
                }
            }
            if (sellList.length > 0) {
                const form = DOM('form')[0];
                if (form.attribs.action.includes('page')) {
                    url = form.attribs.action;
                } else {
                    url = `${form.attribs.action}&page=1`;
                }
                html = await apiUtil.postUrl(sellList.join('&'), url);
                DOM = cheerioUtil.convertHtml(html, true);
                text = DOM.text();
                continue;
            }
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_SELL_REGEX, html, true, true);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function sell end`);
    return await bizHelper.backToMainPage();
};

const trade = async (html) => {
    logger.info(`account: ${global.qxd.name}, function trade start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url;
    while (config.FLAG_LOOP) {
        if (text.includes(config.BREAK_TEXT_SELL_YUBI)) {
            break;
        }
        if (text.includes('挂售英雄数')) {
            const cardList = [];
            const hrefs = DOM('a');
            const cardText = text.split('品阶低 ')[1].split('首页')[0].split('玉币挂售');
            for (let i = 0, j = 0; i < hrefs.length; i++) {
                if (hrefs[i].children[0].data === '玉币挂售') {
                    const cardInfo = {
                        cardName: cardText[j].split('(')[0],
                        cardSkill: cardText[j].split('技能:')[1] === undefined ? '魂卡' : cardText[j].split('技能:')[1],
                        cardUrl: hrefs[i].attribs.href,
                    };
                    if (cardText[j].includes('钻石')) {
                        cardInfo.cardSkill = '钻石';
                    }
                    j += 1;
                    cardList.push(cardInfo);
                }
            }
            // eslint-disable-next-line guard-for-in, no-restricted-syntax
            for (const key in priceList) {
                for (let k = 0; k < cardList.length; k++) {
                    if (text.includes(config.BREAK_TEXT_SELL_YUBI)) {
                        break;
                    }
                    if (key === cardList[k].cardSkill) {
                        await bizUtil.wait(500);
                        html = await apiUtil.getUrl(`玉币挂售: ${cardList[k].cardName}`, cardList[k].cardUrl);
                        DOM = cheerioUtil.convertHtml(html, true);
                        const form = DOM('form')[0];
                        url = form.attribs.action;
                        if (!DOM('input[name=card_id]')[0]) {
                            continue;
                        }
                        const data = `trade_price=${priceList[key]}&trade_type=1&card_id=${DOM('input[name=card_id]')[0].attribs.value}&sure=1`;
                        await bizUtil.wait(500);
                        html = await apiUtil.postUrl(data, url);
                        DOM = cheerioUtil.convertHtml(html, true);
                        text = DOM.text();
                    }
                }
            }
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_SELL_YUBI, html);
        if (!url) {
            break;
        }
        await bizUtil.wait(500);
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function trade end`);
    return await bizHelper.backToMainPage();
};

const statistics = async (html) => {
    logger.info(`account: ${global.qxd.name}, function statistics start`);
    let DOM = cheerioUtil.convertHtml(html, true);
    let text = DOM.text();
    let label; let url;
    if (!global.skill) {
        global.skill = {
            疾风波1级: 0,
            烈焰风暴1级: 0,
            地泉冲击1级: 0,
            剑刃风暴1级: 0,
            地狱火之利刃1级: 0,
            洪流崩涌1级: 0,
            雷龙之利爪1级: 0,
            炎龙之利爪1级: 0,
            水龙之利爪1级: 0,
            奥义·神风斩1级: 0,
            奥义·地狱炎爆1级: 0,
            奥义·极冻领域1级: 0,
            雷龙铠1级: 0,
            火龙铠1级: 0,
            水龙铠1级: 0,
            奥义·风神圣铠1级: 0,
            奥义·火神圣铠1级: 0,
            奥义·水神圣铠1级: 0,
            毁灭之气龙1级: 0,
            毁灭之燃龙1级: 0,
            毁灭之雾龙1级: 0,
            暴风剑舞1级: 0,
            火焰燃烧1级: 0,
            极寒冰刃1级: 0,
            和风佑护1级: 0,
            温暖佑护1级: 0,
            冰冷佑护1级: 0,
            奥义·风雷斩1级: 0,
            奥义·焚火刃1级: 0,
            奥义·冰棱破1级: 0,
        };
    }
    while (config.FLAG_LOOP) {
        if (text.includes('英雄出售')) {
            const cardList = DOM('input');
            for (let i = 0; i < cardList.length - 1; i++) {
                const cardDetail = cardList[i].next.next.next.next.data;
                const cardInfo = {
                    cardValue: cardList[i].attribs.value,
                    cardLevel: cardDetail.split('-')[2],
                    cardSoul: cardDetail.split('-')[3].split('魂')[0],
                    cardSkill: cardDetail.split('-')[4],
                    cardMoney: cardList[i].next.next.next.next.next.children[0].data,
                };
                if (cardInfo.cardLevel === 'lv1') {
                    if (cardInfo.cardSoul < 50) {
                        if (skillList.includes(cardInfo.cardSkill)) {
                            global.skill[cardInfo.cardSkill] += 1;
                        } else if (!global.skill[`${cardInfo.cardMoney}金钱`]) {
                            global.skill[`${cardInfo.cardMoney}金钱`] = 1;
                        } else {
                            global.skill[`${cardInfo.cardMoney}金钱`] += 1;
                        }
                    } else if (!global.skill[`${cardInfo.cardSoul}魂`]) {
                        global.skill[`${cardInfo.cardSoul}魂`] = 1;
                    } else {
                        global.skill[`${cardInfo.cardSoul}魂`] += 1;
                    }
                }
            }
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_SELL_REGEX, html, true, true);
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
        DOM = cheerioUtil.convertHtml(html, true);
        text = DOM.text();
    }
    logger.info(`account: ${global.qxd.name}, function statistics end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    sell,
    trade,
    statistics,
};
