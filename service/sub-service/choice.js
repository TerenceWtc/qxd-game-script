/**
 * 答题
 * Choose the first answer. Prepareing for the Q&A bank with log printer.
 * TODO: Choice the correct answer, low priority.
 */

const util = require('../../util');

const CHOICE_DONE_MSG = '今天答题次数已满，请明天再来。';
const labelArray = ['答题', '开始答题', '继续答题', '领取奖励'];

const choice = async (html, req) => {
  req.logger.info(`account: ${req.account}, function choice start`);
  let label, link, DOM, text;
  while (true) {
    DOM = util.html2DOM(html);
    text = DOM.text();
    if (text.includes(CHOICE_DONE_MSG)) {
      break;
    }
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    if (label == labelArray[3]) {
      break;
    } else if (!label) {
      req.logger.info(text);
      [label, link] = util.getFirstLink(html);
    }
    html = await util.click(label, link, req);
  }
  req.logger.info(`account: ${req.account}, function choice end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  choice
}