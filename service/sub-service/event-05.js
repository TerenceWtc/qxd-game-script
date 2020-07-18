const config = require('../../config');
const util = require('../../util');

const event05 = async (html, req) => {
  req.logger.info(`account: ${req.account}, function ${config.constant.ARRAY_EVENT_05[1]} start`);
  let text, label, url;
  let array = Array.from(config.constant.ARRAY_EVENT_05)
  let slice = true
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.BREAK_TEXT_EVENT_05_COUNT) || text.includes(config.constant.BREAK_TEXT_EVENT_05_ING)) {
      break;
    }
    if (slice && text.includes(config.constant.TEXT_EVENT_05)) {
      array.splice(3, 1);
      slice = false;
    }
    [label, url] = util.getLabelAndURL(array, html);
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function ${config.constant.ARRAY_EVENT_05[1]} end`);
  return await util.backToMainPage(req);
}

module.exports = {
  event05
}