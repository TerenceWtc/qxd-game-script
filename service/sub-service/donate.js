const config = require('../../config');
const util = require('../../util');

const donate = async (html, req) => {
  req.logger.info(`account: ${req.account}, function donate start`);
  let DOM = util.convertHtml(html, true);
  let text = DOM.text();
  let label, url;
  while (config.constant.FLAG_LOOP) {
    if (text.includes(config.constant.BREAK_TEXT_DONATE)) {
      break;
    }
    if (text.includes(config.constant.TEXT_DONATE)) {
      let regex = new RegExp(config.constant.REGEX_MONEY);
      let money = regex.exec(text)[0]
      money = money.split(':')[1];
      money = Math.floor(money / 10000000) * 1000;
      let form = DOM('form')[0];
      let data = `donate_number=${money}`;
      url = form.attribs.action;
      html = await util.post(data, url, req);
      DOM = util.convertHtml(html, true);
      text = DOM.text();
      continue;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_DONATE, html, true);
    if (!url) {
      break;
    }
    html = await util.click(label, url, req);
    DOM = util.convertHtml(html, true);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function donate end`);
  return await util.backToMainPage(req);
}

module.exports = {
  donate
}