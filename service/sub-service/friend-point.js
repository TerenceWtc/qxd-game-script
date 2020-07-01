/**
 * 友情点
 */
const config = require('../../config');
const util = require('../../util');

const labelArray = ['好友', '每日留言加油 '];

const friendPoint = async (html, req) => {
  req.logger.info(`account: ${req.account}, function friendPoint start`);
  let text, label, link;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(DUPLICATE)) {
      html = await util.backToMainPage(req);
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
  }
  req.logger.info(`account: ${req.account}, function friendPoint end`);
  return await util.backToMainPage(req);
}

module.exports = {
  friendPoint
}