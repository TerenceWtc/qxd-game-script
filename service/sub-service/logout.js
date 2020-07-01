/**
 * logout
 */
const config = require('../../config');
const util = require('../../util');

const logout = async (html, req) => {
  req.logger.info(`account: ${req.account}, function logout start`);
  let text, label, url;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.BREAK_TEXT_LOGOUT)) {
      break;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_LOGOUT, html, true);
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function logout end`);
}

module.exports = {
  logout
}