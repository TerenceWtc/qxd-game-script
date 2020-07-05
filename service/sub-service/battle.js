const config = require('../../config');
const util = require('../../util');
const ARRAY_PLAYER = config.settings['对战'];

const battle = async (html, req) => {
  req.logger.info(`account: ${req.account}, function battle start`);
  let DOM = util.convertHtml(html, true);
  let text = DOM.text();
  let label, url;
  while (config.constant.FLAG_LOOP) {
    if (text.includes(config.constant.BREAK_TEXT_BATTLE_COUNT) || text.includes(config.constant.BREAK_TEXT_BATTLE)) {
      break;
    }
    if (text.includes(config.constant.TEXT_BATTLE_PLAYER_ID)) {
      let regex = new RegExp(config.constant.REGEX_NAME, 'g');
      let match = text.match(regex);
      if (match.length > 1) {
        let form = DOM('form')[0];
        url = `${form.attribs.action}&user_id=${ARRAY_PLAYER}`;
        html = await util.post('', url, req);
        DOM = util.convertHtml(html, true);
        text = DOM.text();
        continue;
      }
    }    
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_BATTLE, html, undefined, true);
    html = await util.click(label, url, req);
    DOM = util.convertHtml(html, true);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function battle end`);
  return await util.backToMainPage(req);
}

module.exports = {
  battle
}