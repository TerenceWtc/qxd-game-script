/**
 * 探险
 * Explore the latest area, clear the BOSS, sell all the cards
 * TODO: specific the area to explore, (maybe need retain specific cards), low priority.
 */

const util = require('../../util');

const NOT_ENOUGH_EXPLORE_POINT_MSG = '当前行动力已无法执行此任务！！';
const labelArray = ['探险', '挑战BOSS', '探索新的地区', '执行探险', '继续执行', '卖出', '确定', '确认', '继续', '开始战斗', '攻击', '下一个地区'];

const explore = async (html, req) => {
  req.logger.info(`account: ${req.account}, function explore start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (!text.includes(NOT_ENOUGH_EXPLORE_POINT_MSG)) {
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function explore end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  explore
}