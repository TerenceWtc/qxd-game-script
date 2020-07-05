const config = require('../../config');
const util = require('../../util');
const ARRAY_BENEFIT_NAME = config.settings['世家福利'];

const benefit = async (html, req) => {
  req.logger.info(`account: ${req.account}, function benefit start`);
  let DOM, href, label, url, index;
  let purchaseUrl = [], purchaseLabel = [];
  let benefitName = Array.from(ARRAY_BENEFIT_NAME);
  while (config.constant.FLAG_LOOP) {
    DOM = util.convertHtml(html, true);
    href = DOM('a');
    if (label == "庄园福利") {
      href.toArray().filter(item => {
        if (item.children[0].data == '购买') {
          purchaseUrl.push(item.attribs.href);
          purchaseLabel.push(item.prev.prev.data.split(':')[0]);
        }
      });
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_BENEFIT, html);
    if (!url) {
      await util.wait();
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
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function benefit end`);
  return await util.backToMainPage(req);
}

module.exports = {
  benefit
}