/**
 * 合练
 * Training with the same player as yesterday's.
 */

const util = require('../../util');

const labelArray = ['合练', '昨日', '邀请'];

const training = async (html, req) => {
  req.logger.info(`account: ${req.account}, function training start`);
  let label, link;
  while (true) {
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
    req.logger.info(text);
  }
  req.logger.info(`account: ${req.account}, function training end`);
  return await util.backToMainPage(html, req);
}

module.exports = {
  training
}