/**
 * 抽卡
 * Free 3 draws per day.
 */
const config = require('../../config');
const util = require('../../util');

const draw = async (html, req) => {
  req.logger.info(`account: ${req.account}, function draw start`);
  let text, label, url;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.TEXT_FREE_DRAW)) {
      url = util.getLinksByName(config.constant.LABEL_FREE_DRAW, html);
      html = await util.click(config.constant.LABEL_FREE_DRAW, url, req);
      continue;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_DRAW, html);
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function draw end`);
  return await util.backToMainPage(req);
}

module.exports = {
  draw
}