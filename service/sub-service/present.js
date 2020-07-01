/**
 * 礼物
 */
const config = require('../../config');
const util = require('../../util');

const present = async (html, req) => {
  req.logger.info(`account: ${req.account}, function present start`);
  let text, label, url;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.BREAK_TEXT_PRESENT)) {
      break;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_PRESENT_REGEX, html, undefined, true);
    if (!url) {
      [label, url] = util.getLabelAndURL(config.constant.ARRAY_PRESENT, html);
    }
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function present end`);
  return await util.backToMainPage(req);
}

module.exports = {
  present
}