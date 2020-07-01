const util = require('../../util');

const common = async (html, functionName, loop, breakText, array, req) => {
  req.logger.info(`account: ${req.account}, function ${functionName} start`);
  let text, label, url;
  while (loop) {
    text = util.convertHtml(html);
    if (text.includes(breakText)) {
      break;
    }
    [label, url] = util.getLabelAndURL(array, html);
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function ${functionName} end`);
  return await util.backToMainPage(req);
}

module.exports = {
  common
}