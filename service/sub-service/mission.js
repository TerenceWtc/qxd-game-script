/**
 * 每日任务奖励
 * Receive daily mission rewards.
 */
const config = require('../../config');
const util = require('../../util');

const MISSION_COMPLETE = '今日活跃度:10';
const labelArray = ['您的每日任务还未完成', '有每日任务奖励可领取', '有奖励可领取', '领取', '返回'];

const mission = async (html, req) => {
  req.logger.info(`account: ${req.account}, function mission start`);
  let text, label, link;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(MISSION_COMPLETE)) {
      break;
    }
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    if (!label) {
      break;
    }
    html = await util.click(label, link, req);
  }
  req.logger.info(`account: ${req.account}, function mission end`);
  return await util.backToMainPage(req);
}

module.exports = {
  mission
}