const cheerioUtil = require('./cheerio');

const randomIP = () => {
    const ip = [];
    for (let i = 0; i < 4; i++) {
        ip.push(Math.floor(Math.random() * 254 + 2));
    }
    return ip.join('.');
};

const getLinksByName = (name, html, isFull, isReg, isBold) => {
    const document = cheerioUtil.convertHtml(html, true);
    let hyperLinks = document('a');
    let resultUrl;
    hyperLinks = isFull ? hyperLinks.toArray() : hyperLinks.toArray().slice(0, -4);
    if (isReg) {
        const nameReg = new RegExp(`${name}`, 'g');
        resultUrl = hyperLinks.find((hyperLink) => {
            return nameReg.test(hyperLink.children[0].data);
        });
    } else {
        resultUrl = hyperLinks.find((hyperLink) => {
            if (isBold && hyperLink.children[0].children) {
                return hyperLink.children[0].children[0].data == name;
            }
            return hyperLink.children[0].data == name;
        });
    }
    return resultUrl ? resultUrl.attribs.href : false;
};

const getLabelAndURL = (labelArray, html, isFull = false, isReg = false, isBold = false) => {
    let url;
    const label = labelArray.find((arr) => {
        url = getLinksByName(arr, html, isFull, isReg, isBold);
        return url;
    });
    return [label, url];
};

const getAccountInfo = (html) => {
    const text = cheerioUtil.convertHtml(html);
    const accountInfo = {};

    if (text.includes('[MM]')) {
        accountInfo.name = text.split('[MM]')[1].split('(')[0];
    } else if (text.includes('[GG]')) {
        accountInfo.name = text.split('[GG]')[1].split('(')[0];
    }
    accountInfo.uid = text.split('ID:')[1].split('累计登陆:')[0];
    accountInfo.yubi = text.split('所持玉币:')[1].split('所持灵玉:')[0];

    return accountInfo;
};

const getAccountAssets = (html) => {
    const text = cheerioUtil.convertHtml(html);
    const accountAsstes = {};
    accountAsstes.bank = text.split('金钱 : ')[1].split('友情点 : ')[0];
    accountAsstes.friendPoint = text.split('友情点 : ')[1].split('好友 : ')[0];
    accountAsstes.cardCount = text.split('英雄 : ')[1].split('图鉴')[0];

    return accountAsstes;
};

const getFirstLink = (html) => {
    const document = cheerioUtil.convertHtml(html, true);
    const hyperLinks = document('a');
    const result = hyperLinks.toArray().shift();
    return [result.children[0].data, result.attribs.href];
};

module.exports = {
    randomIP,
    getLabelAndURL,
    getAccountInfo,
    getAccountAssets,
    getFirstLink,
    getLinksByName,
};
