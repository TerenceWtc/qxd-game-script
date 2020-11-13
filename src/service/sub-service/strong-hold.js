const config = require('../../config');
const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, cheerioUtil, apiUtil } = require('../../utils');

const ARRAY_STRONG_HOLD_NAME = config['据点'];

const strongHold = async (html) => {
    const strongHoldList = Array.from(ARRAY_STRONG_HOLD_NAME);
    logger.info(`account: ${global.qxd.name}, function strongHold start`);
    let text; let label; let url; let stage; let page;
    while (config.FLAG_LOOP) {
        text = cheerioUtil.convertHtml(html);
        if (text.includes(config.BREAK_TEXT_STRONG_HOLD) || text.includes(config.BREAK_TEXT_STRONG_HOLD_COUNT) || text.includes(config.BREAK_TEXT_STRONG_HOLD_LEVEL) || text.includes(config.BREAK_TEXT_STRONG_HOLD_SUCCESS)) {
            break;
        }
        [label, url] = bizUtil.getLabelAndURL(config.ARRAY_STRONG_HOLD, html);

        // if not in array
        if (!url) {
            // shift the first strong hold in settings.
            if (strongHoldList.length > 0) {
                [label, url] = bizUtil.getLabelAndURL([strongHoldList[0]], html);

                if (url) {
                    stage = strongHoldList.shift();
                    page = 2;
                    html = await apiUtil.getUrl(label, url);
                    continue;
                }
            } else {
                [label, url] = bizUtil.getLabelAndURL([stage], html);
            }
            if (url) {
                // continue
            } else if (stage === '紫荆关') {
                // both 2 pages have no resource.
                if (page > 2) {
                    html = await bizHelper.backToMainPage();
                    continue;
                }
                [label, url] = bizUtil.getLabelAndURL([`${page}`], html);
            } else if (stage === '玉门关') {
                // all the five pages have no resource, never be tested
                if (page > 5) {
                    break;
                }
                [label, url] = bizUtil.getLabelAndURL([`${page}`], html);
            }

            page += 1;
        }
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function strongHold end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    strongHold,
};
