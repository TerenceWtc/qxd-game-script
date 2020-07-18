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
// 遗迹争夺战已结束。

const FINISH_MSG = '查看上次战斗结果';
const NO_ENOUGH_ATTACK_POINT_MSG = '你的攻魂不足以产生伤害！';
const OTK_LABEL = ['一键攻击遗迹', '一键修复遗迹', "一键攻击遗迹守护石像"];
// const NOMAL_ATTACK_LABEL = ['攻击遗迹', "攻击遗迹守护石像", '修复遗迹'];
const labelArray = ['遗迹', '已开战', '加入防守方', '加入进攻方', '进入战斗'];

const util = require('../../util');

const remainsFull1 = async (html, req) => {
  req.logger.info('function remainsFull start');
  let text, label, url, bloodTxt, blood;
  text = util.convertHtml(html);
  blood = null;
  while (true) {
    if (text.includes(FINISH_MSG)) {
      break;
    }
    if (text.includes("你的世家对遗迹共修复")) {
      bloodTxt = text.split("遗迹耐久：")[1].split("攻击方玩家数")[0];
      blood = bloodTxt.split("/")[0] / bloodTxt.split("/")[1];
      req.logger.info(`blood: ${blood}`);
    }
    if (blood && blood > 0.6) {
      [label, url] = util.getLabelAndURL(['刷新'], html, true);
      if (!url) {
        continue;
      }
      html = await util.click(label, url, req);
      text = util.convertHtml(html);
      continue;
    }

    if (text.includes(NO_ENOUGH_ATTACK_POINT_MSG)) {
      [label, url] = util.getFirstLink(html)
    } else {
      [label, url] = util.getLabelAndURL(labelArray, html, true);
    }
    if (!url) {
      [label, url] = util.getLabelAndURL(OTK_LABEL, html, true);
    }
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
    text = util.convertHtml(html);
  }
  req.logger.info('function remainsFull end');
  return await util.backToMainPage(req);
}

const remainsFull2 = async (html, req) => {
  req.logger.info('function remainsFull start');
  let text, label, url, bloodTxt, blood;
  text = util.convertHtml(html);
  blood = null;
  while (true) {
    if (text.includes(FINISH_MSG)) {
      break;
    }
    if (text.includes("你的世家对遗迹共修复")) {
      bloodTxt = text.split("遗迹耐久：")[1].split("攻击方玩家数")[0];
      blood = bloodTxt.split("/")[0] / bloodTxt.split("/")[1];
      req.logger.info(`blood: ${blood}`);
    }
    if (blood && blood < -0.6) {
      [label, url] = util.getLabelAndURL(['刷新'], html, true);
      if (!url) {
        continue;
      }
      html = await util.click(label, url, req);
      text = util.convertHtml(html);
      continue;
    }

    if (text.includes(NO_ENOUGH_ATTACK_POINT_MSG)) {
      [label, url] = util.getFirstLink(html)
    } else {
      [label, url] = util.getLabelAndURL(labelArray, html, true);
    }
    if (!url) {
      [label, url] = util.getLabelAndURL(OTK_LABEL, html, true);
    }
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
    text = util.convertHtml(html);
  }
  req.logger.info('function remainsFull end');
  return await util.backToMainPage(req);
}

const remains28Fast = async (html, req) => {
//   req.logger.info('function remains28Fast start');
//   let DOM = util.convertHtml(html, true);
//   let text = DOM.text();
//   let label, url;
//   while (!text.includes(NOT_ENOUGH_EXPLORE_POINT_MSG)) {
//     label = labelArray.find(arr => {
//       url = util.getLinksByName(arr, html);
//       return url != null;
//     });
//     html = await util.click(label, url, req);
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
//   let label, url;
//   while (!text.includes(NOT_ENOUGH_EXPLORE_POINT_MSG)) {
//     label = labelArray.find(arr => {
//       url = util.getLinksByName(arr, html);
//       return url != null;
//     });
//     html = await util.click(label, url, req);
//     DOM = util.convertHtml(html, true);
//     text = DOM.text();
//   }
//   req.logger.info('function remains28Slow end');
//   return await util.backToMainPage(req);
}

const remainsMission = async (html, req) => {
  req.logger.info(`account: ${req.account}, function remainsMission start`);
  let label = labelArray[0]
  let url;
  url = util.getLinksByName(label, html);
  if (url) {
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function remainsMission end`);
  return await util.backToMainPage(req);
}

module.exports = {
  remainsFull1,
  remainsFull2,
  remains28Fast,
  remains28Slow,
  remainsMission
}