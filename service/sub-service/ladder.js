/**
 * 天梯
 */

const util = require('../../util');

const NOT_ENOUGH_LADDER_COUNT_MSG = '天梯令不足，天梯令每15分钟恢复1个。';
const labelArray = ['天梯', '进行对战', '继续挑战', '挑战结果', '跳过过程'];

const ladder = async (html, req) => {
  req.logger.info(`account: ${req.account}, function ladder start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (!text.includes(NOT_ENOUGH_LADDER_COUNT_MSG)) {
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function ladder end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  ladder
}