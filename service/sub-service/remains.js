/**
 * 遗迹, 吃药满攻击一键
 * Auto attack with full attack point, and recovery the attack point.
 */
// 进入战斗 已开战
// 加入防守方 加入进攻方
// 攻击遗迹
// 一键攻击遗迹
// 修复遗迹
// 一键修复遗迹
// 刷新
// 攻魂:20/20
// 你的攻魂不足以产生伤害！ 你的攻魂不足，请使用恢复物品后进行战斗
// 使用攻防恢复丸[38]

const FINISH_MSG = '查看上次战斗结果';
const NO_ENOUGH_ATTACK_POINT_MSG = '你的攻魂不足以产生伤害！';
const OTK_LABEL = ['一键攻击遗迹', '一键修复遗迹'];
const NOMAL_ATTACK_LABEL = ['攻击遗迹', '修复遗迹'];
const labelArray = ['遗迹', '已开战', '加入防守方', '加入进攻方', '进入战斗'];

const util = require('../../util');

const remainsFull = async (html, req) => {
  req.logger.info('function remainsFull start');
  let text, label, link;
  let i = 0;
  while (i < 10) {
    text = util.convertHtml(html);
    i++;
    if (text.includes(NO_ENOUGH_ATTACK_POINT_MSG)) {
      [label, link] = util.getFirstLink(html)
    } else {
      label = labelArray.find(arr => {
        link = util.getLinksByName(arr, html);
        return link != null;
      });
    }
    html = await util.click(label, link, req);
    req.logger.info('label: ', label);
    req.logger.info('link: ', link);
    text = util.convertHtml(html);
    req.logger.info(text);
  }
  req.logger.info('function remainsFull end');
  return await util.backToMainPage(req);
}

const remains28Fast = async (html, req) => {
//   req.logger.info('function remains28Fast start');
//   let DOM = util.convertHtml(html, true);
//   let text = DOM.text();
//   let label, link;
//   while (!text.includes(NOT_ENOUGH_EXPLORE_POINT_MSG)) {
//     label = labelArray.find(arr => {
//       link = util.getLinksByName(arr, html);
//       return link != null;
//     });
//     html = await util.click(label, link, req);
//     DOM = util.convertHtml(html, true);
//     text = DOM.text();
//   }
//   req.logger.info('function remains28Fast end');
//   return await util.backToMainPage(req);
}

const remains28Slow = async (html, req) => {
//   req.logger.info('function remains28Slow start');
//   let DOM = util.convertHtml(html, true);
//   let text = DOM.text();
//   let label, link;
//   while (!text.includes(NOT_ENOUGH_EXPLORE_POINT_MSG)) {
//     label = labelArray.find(arr => {
//       link = util.getLinksByName(arr, html);
//       return link != null;
//     });
//     html = await util.click(label, link, req);
//     DOM = util.convertHtml(html, true);
//     text = DOM.text();
//   }
//   req.logger.info('function remains28Slow end');
//   return await util.backToMainPage(req);
}

const remainsMission = async (html, req) => {
  req.logger.info(`account: ${req.account}, function remainsMission start`);
  let label = labelArray[0]
  let link;
  link = util.getLinksByName(label, html);
  if (link) {
    html = await util.click(label, link, req);
  }
  req.logger.info(`account: ${req.account}, function remainsMission end`);
  return await util.backToMainPage(req);
}

module.exports = {
  remainsFull,
  remains28Fast,
  remains28Slow,
  remainsMission
}