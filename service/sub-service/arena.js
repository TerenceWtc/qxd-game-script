/**
 * 竞技
 * Choose the first available player to battle.
 */

const util = require('../../util');

const NOT_ENOUGH_ARENA_COUNT_MSG = '今天剩余次数:0/10';
const labelArray = ['竞技', '挑战', '开始对战', '挑战结果', '跳过过程', '返回'];

const arena = async (html, req) => {
  req.logger.info(`account: ${req.account}, function arena start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (!text.includes(NOT_ENOUGH_ARENA_COUNT_MSG)) {
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function arena end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  arena
}