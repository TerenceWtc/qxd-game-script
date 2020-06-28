/**
 * logout
 */

const util = require('../../util');

const LOGOUT_SUCCESS_MSG= '退出账号成功';
const labelArray = ['退出', '确认退出'];

const logout = async (html, req) => {
  req.logger.info(`account: ${req.account}, function logout start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (!text.includes(LOGOUT_SUCCESS_MSG)) {
    label = labelArray.find(arr => {
      link = util.getFullLinksByName(arr, html);
      return link != null;
    });
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function logout end`);
}

module.exports = {
  logout
}