const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const ARRAY_BENEFIT_NAME = config['世家福利'];

const benefit = async (html) => {
    logger.info(`account: ${global.qxd.name}, function benefit start`);
    let DOM; let href; let label; let url; let index;
    const purchaseUrl = []; const purchaseLabel = [];
    const benefitName = Array.from(ARRAY_BENEFIT_NAME);
    while (config.FLAG_LOOP) {
        DOM = cheerioUtil.convertHtml(html, true);
        href = DOM('a');
        if (label === '庄园福利') {
            href.toArray().filter((item) => {
                if (item.children[0].data === '购买') {
                    purchaseUrl.push(item.attribs.href);
                    purchaseLabel.push(item.prev.prev.data.split(':')[0]);
                }
                return null;
            });
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_BENEFIT, html);
        if (!url) {
            await apiUtil.wait();
            for (let i = 0; i < purchaseLabel.length; i++) {
                index = purchaseLabel.indexOf(benefitName[i]);
                if (index >= 0) {
                    label = benefitName.splice(i, 1);
                    url = purchaseUrl[index];
                    break;
                }
            }
        }
        if (!url) {
            break;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function benefit end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    benefit,
};
