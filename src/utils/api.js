const bizUtil = require('./biz');
const cheerioUtil = require('./cheerio');
const api = require('../api');
const config = require('../config');
const logger = require('../log');

const wait = (waitSeconds = 200) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, waitSeconds);
});

const getUrl = async (label, url, seconds = 100) => {
    await wait(seconds);
    if (url) {
        logger.info(`account: ${global.qxd.name}, click: ${label}`);
        try {
            let html = await api.getApi(url);
            const DOM = cheerioUtil.convertHtml(html, true);
            if (DOM('title').text() === config.TITLE_BOOKMARK) {
                html = await api.getApi(bizUtil.getLinksByName(config.TEXT_RETURN_GAME, html, true));
            }
            if (DOM('title').text() === config.TITLE_TOO_FAST) {
                html = await api.getApi(bizUtil.getLinksByName(config.LABEL_MAIN_PAGE, global.qxd.mainPageLink));
            }
            if (DOM.text().includes(config.TEXT_IP_BIND)) {
                logger.error(config.TEXT_IP_BIND);
            }
            if (!html) {
                logger.error('html: ', html);
                throw new Error('error html');
            }
            if (html.replace(/(^\s*)|(\s*$)/g, '') === '') {
                throw new Error('empty html');
            }
            return html;
        } catch (err) {
            logger.error('get request error:', err);
            return await api.getApi(bizUtil.getLinksByName(config.LABEL_MAIN_PAGE, global.qxd.mainPageLink));
        }
    }
    logger.error(`account: ${global.qxdname}, click: ${label}, url: ${url} not found`);
    return null;
};

const postUrl = async (data, url, seconds = 100) => {
    await wait(seconds);
    if (url) {
        logger.info(`account: ${global.qxd.name}, post: ${data}`);
        try {
            let html = await api.postApi(data, url);
            const DOM = cheerioUtil.convertHtml(html, true);
            if (DOM('title').text() === config.TITLE_BOOKMARK) {
                html = await api.getApi(bizUtil.getLinksByName(config.TEXT_RETURN_GAME, html, true));
            }
            if (DOM('title').text() === config.TITLE_TOO_FAST) {
                html = await bizUtil.getLinksByName(config.LABEL_MAIN_PAGE, global.qxd.mainPageLink);
            }
            if (DOM.text().includes(config.TEXT_IP_BIND)) {
                logger.error(config.TEXT_IP_BIND);
            }
            if (!html) {
                logger.error('html: ', html);
                throw new Error('error html');
            }
            if (html.replace(/(^\s*)|(\s*$)/g, '') === '') {
                throw new Error('empty html');
            }
            return html;
        } catch (err) {
            logger.error('post request error:', err);
            return await getUrl(data, url, seconds);
        }
    }
    logger.error(`account: ${global.qxd.name}, post: ${data}, url: ${url} not found`);
    return null;
};

module.exports = {
    wait,
    getUrl,
    postUrl,
};
