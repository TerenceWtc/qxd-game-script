/**
 * 抽卡
 * Free 3 draws per day.
 */
const util = require('../../util');

const RETURN_DRAW_PAGE_LABEL = '返回抽卡页面'
const FREE_DRAW_LABEL = '友情唤醒';
const FREE_DRAW_MSG = '首次免费';
const labelArray = ['每日免费抽奖', '午间免费抽奖', '晚间免费抽奖', '免费唤醒'];

const draw = async (html, req) => {
  req.logger.info(`account: ${req.account}, function draw start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (true) {
    if (text.includes(FREE_DRAW_MSG)) {
      link = util.getLinksByName(FREE_DRAW_LABEL, html);
      html = await util.click(FREE_DRAW_LABEL, link, req);
      DOM = util.html2DOM(html);
      text = DOM.text();
      continue;
    }
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    if (!label) {
      break;
    }
    if (util.getLinksByName(RETURN_DRAW_PAGE_LABEL, html)) {
      html = await util.backToMainPage(html, req);
      DOM = util.html2DOM(html);
      text = DOM.text();
      continue;
    }
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function draw end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  draw
}