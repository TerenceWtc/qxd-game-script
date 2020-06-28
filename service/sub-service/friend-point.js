/**
 * 友情点
 */

const util = require('../../util');

const DUPLICATE = '好友加油今天已经加过油了！';
const labelArray = ['好友', '每日留言加油 '];

const friendPoint = async (html, req) => {
  req.logger.info(`account: ${req.account}, function friendPoint start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (true) {
    if (text.includes(DUPLICATE)) {
      html = await util.backToMainPage(html, req);
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
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function friendPoint end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  friendPoint
}