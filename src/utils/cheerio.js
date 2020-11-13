const cheerio = require('cheerio');

const logger = require('../log');

const convertHtml = (html, isDOM = false) => {
    try {
        const document = cheerio.load(html);
        return isDOM ? document : document.text();
    } catch (err) {
        logger.error(`convertHtml error: ${err.message}, html content: ${html}`);
        // TODO: back to main page
        throw err;
    }
};

module.exports = {
    convertHtml,
};
