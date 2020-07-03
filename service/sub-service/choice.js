/**
 * 答题
 * Choose the first answer. Prepareing for the Q&A bank with log printer.
 * TODO: Choice the correct answer, low priority.
 */
const config = require('../../config');
const util = require('../../util');

const choice = async (html, req) => {
  req.logger.info(`account: ${req.account}, function choice start`);
  let text, label, url;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.BREAK_TEXT_CHOICE)) {
      break;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_CHOICE, html);
    if (label == config.constant.ARRAY_CHOICE[3]) {
      break;
    }
    if (!url) {
      req.logger.warn(text);
      [label, url] = util.getFirstLink(html);
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function choice end`);
  return await util.backToMainPage(req);
}

module.exports = {
  choice
}