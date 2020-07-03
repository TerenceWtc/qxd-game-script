const config = require('../../config');
const util = require('../../util');
const ARRAY_STRONG_HOLD_NAME = config.settings['据点'];

const strongHold = async (html, req) => {
  req.logger.info(`account: ${req.account}, function strongHold start`);
  let text, label, url, stage, page;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.BREAK_TEXT_STRONG_HOLD) || text.includes(config.constant.BREAK_TEXT_STRONG_HOLD_COUNT) || text.includes(config.constant.BREAK_TEXT_STRONG_HOLD_LEVEL) || text.includes(config.constant.BREAK_TEXT_STRONG_HOLD_SUCCESS)) {
      break;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_STRONG_HOLD, html);
    if (!url) {
      for (let i = 0; i < ARRAY_STRONG_HOLD_NAME.length; i++) {
        [label, url] = util.getLabelAndURL([ARRAY_STRONG_HOLD_NAME[i]], html);
        if (url) {
          stage = label;
          page = 1;
          html = await util.click(label, url, req);
          break;
        }
      }
      if (page == 1) {
        page++
        continue;
      }
      if (stage == '紫荆关') {
        if (page > 2) {
          break;
        }
        [label, url] = util.getLabelAndURL([page], html);
      } else if (stage == '玉门关') {
        if (page > 5) {
          break;
        }
        [label, url] = util.getLabelAndURL([page], html);
      }
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function strongHold end`);
  return await util.backToMainPage(req);
}

module.exports = {
  strongHold
}