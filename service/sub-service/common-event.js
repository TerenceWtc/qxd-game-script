const util = require('../../util');

const commonEvent = async (html, functionName, loop, array, req) => {
  req.logger.info(`account: ${req.account}, function ${functionName} start`);
  let label, url;
  let receive = false;
  while (loop) {
    if (receive) {
      receive = false;
      [label, url] = util.getLabelAndURL(["返回"], html);
      if (!label) {
        html = await util.backToMainPage(req);
        continue;
      }
      html = await util.click(label, url, req);
      continue;
    }
    [label, url] = util.getLabelAndURL(array, html);
    receive = label == '领取';
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function ${functionName} end`);
  return await util.backToMainPage(req);
}

module.exports = {
  commonEvent
}