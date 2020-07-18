/**
 * 
 */

const config = require('../config');
const util = require('../util');
const sub = require('./sub-service');

const accounts = config.settings['任务账号'];
const constant = config.constant;

const dailyMission = async (req) => {
  req.logger.info('start daliy mission');
  let html;

  // check version
  if (!util.checkVersion()) {
    req.logger.error('Your version is expired, please get the latest one.');
    req.logger.error('版本已过时，请获取最新版');
    return;
  }

  for (let i = 0; i < accounts.length; i++) {

    // generate IP
    global.ip = util.randomIP();
    req.logger.info(`IP: ${global.ip}`);

    // login
    html = await util.getInstance(accounts[i]);
    req.account = util.getAccountName(html);

    // store main page
    global.mainPageLink = await util.getMainPage(html, req);

    // missions
    html = await sub.common(html, 'explore', constant.FLAG_LOOP, constant.BREAK_TEXT_EXPLORE, constant.ARRAY_EXPLORE, req);
    html = await sub.benefit.benefit(html, req);
    html = await sub.common(html, 'stonehenge', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_STONEHENGE, req)
    html = await sub.common(html, 'explore', constant.FLAG_LOOP, constant.BREAK_TEXT_EXPLORE, constant.ARRAY_EXPLORE, req);
    html = await sub.common(html, 'ladder', constant.FLAG_LOOP, constant.BREAK_TEXT_LADDER, constant.ARRAY_LADDER, req);
    html = await sub.common(html, 'arena', constant.FLAG_LOOP, constant.BREAK_TEXT_ARENA, constant.ARRAY_ARENA, req);
    html = await sub.common(html, 'training', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_TRAINING, req);
    html = await sub.subChoice.choice(html, req);
    html = await sub.subRemains.remainsMission(html, req);
    html = await sub.subInstanceZones.instanceZones(html, req);
    html = await sub.subDraw.draw(html, req);
    html = await sub.common(html, 'friend-point', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_FRIEND_POINT, req);
    html = await sub.common(html, 'mission', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_MISSION, req);
    html = await sub.strongHold.strongHold(html, req);
    if (config.settings['自动领取礼物']) {
      html = await sub.subPresent.present(html, req);
    }
    if (config.settings['对战'] != "") {
      html = await sub.battle.battle(html, req);
    }
    if (config.settings['自动捐钱']) {
      html = await sub.donate.donate(html, req);
    }

    html = await sub.common(html, constant.ARRAY_EVENT_01[1], constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_EVENT_01, req);
    html = await sub.common(html, constant.ARRAY_EVENT_02[1], constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_EVENT_02, req);
    html = await sub.common(html, constant.ARRAY_EVENT_03[1], constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_EVENT_03, req);
    html = await sub.common(html, constant.ARRAY_EVENT_04[1], constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_EVENT_04, req);
    // html = await sub.event05.event05(html, req);
    html = await sub.commonEvent(html, constant.ARRAY_EVENT_10[1], constant.FLAG_LOOP, constant.ARRAY_EVENT_10, req);
    html = await sub.common(html, constant.ARRAY_EVENT_11[1], constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_EVENT_11, req);
    html = await sub.commonEvent(html, constant.ARRAY_EVENT_12[1], constant.FLAG_LOOP, constant.ARRAY_EVENT_12, req);
    // logout
    await sub.subLogout.logout(html, req);
  }
  req.logger.info(`daily mission complete! finish ${accounts.length} accounts.`);
  // res.status(200);
  // res.send('ok');
}

module.exports = {
  dailyMission
}