const config = require('../../config');
const util = require('../../util');
const ARRAY_STRONG_HOLD_NAME = config.settings['据点'];

const strongHold = async (html, req) => {
  let strongHold = Array.from(ARRAY_STRONG_HOLD_NAME);
  req.logger.info(`account: ${req.account}, function strongHold start`);
  let text, label, url, stage, page;
  while (config.constant.FLAG_LOOP) {
    text = util.convertHtml(html);
    if (text.includes(config.constant.BREAK_TEXT_STRONG_HOLD) || text.includes(config.constant.BREAK_TEXT_STRONG_HOLD_COUNT) || text.includes(config.constant.BREAK_TEXT_STRONG_HOLD_LEVEL) || text.includes(config.constant.BREAK_TEXT_STRONG_HOLD_SUCCESS)) {
      break;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_STRONG_HOLD, html);

    // if not in array
    if (!url) {
      // shift the first strong hold in settings.
      if (strongHold.length > 0) {
        [label, url] = util.getLabelAndURL([strongHold[0]], html);
        
        if (url) {
          stage = strongHold.shift();
          page = 2;
          html = await util.click(label, url, req);
          continue;
        }
      }
      
      if (stage == '紫荆关') {
        // both 2 pages have no resource.
        if (page > 2) {
          html = await util.backToMainPage(req);
          continue;
        }
        [label, url] = util.getLabelAndURL([page], html);
      } else if (stage == '玉门关') {
        // all the five pages have no resource, never be tested
        if (page > 5) {
          break;
        }
        [label, url] = util.getLabelAndURL([page], html);
      }
      
      page++;
    }
    html = await util.click(label, url, req);
  }
  req.logger.info(`account: ${req.account}, function strongHold end`);
  return await util.backToMainPage(req);
}

module.exports = {
  strongHold
}