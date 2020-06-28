/**
 * 副本
 * Choose the second hard difficulty, if only one, use the fisrt.
 * Choose the first skill.
 */

const util = require('../../util');

const INFOMATION_NOT_MATCH = '提示挑战信息不一致！';
const DIFFICULTY_CHOICE_MSG = '难度选择:';
const NOT_CHANCE_MSG = '今天还剩0次。';
const labelArray = ['副本', '过关斩将', '继续挑战', '进入下一关', '确认'];

const instanceZones = async (html, req) => {
  req.logger.info(`account: ${req.account}, function instanceZones start`);
  let DOM = util.html2DOM(html);
  let text = DOM.text();
  let label, link;
  while (!text.includes(NOT_CHANCE_MSG) || util.getLinksByName(labelArray[2], html)) {
    req.logger.debug('loop')
    if (text.includes(INFOMATION_NOT_MATCH)) {
      html = await util.backToMainPage(html, req);
      DOM = util.html2DOM(html);
      text = DOM.text();
      continue;
    }
    if (text.includes(DIFFICULTY_CHOICE_MSG)) {
      let personType = DOM('option').length == 1 ? 1 : DOM('option').get(-2).attribs.value;
      let form = getForm(html);
      let data = {
        'person_type': personType
      }
      link = form.attribs.action;
      html = await util.post(data, link, req);
      DOM = util.html2DOM(html);
      text = DOM.text();
      continue;
    }
    label = labelArray.find(arr => {
      link = util.getLinksByName(arr, html);
      return link != null;
    });
    if (label == labelArray[4]) {
      html = await util.click(label, link, req);
      DOM = util.html2DOM(html);
      text = DOM.text();
      continue;
    } else if (!label) {
      req.logger.debug(text);
      [label, link] = util.getFirstLink(html);
    }
    html = await util.click(label, link, req);
    DOM = util.html2DOM(html);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function instanceZones end`);
  return await util.backToMainPage(html, req);
}

const getForm = (html) => {
  let DOM = util.html2DOM(html);
  return DOM('form')[0];
}

module.exports = {
  instanceZones
}