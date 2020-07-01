/**
 * 
 */

const config = require('../config');
const util = require('../util');
const sub = require('./sub-service');

const accounts = config.account['任务账号'];
const constant = config.constant;

const dailyMission = async (req) => {
  req.logger.info('start daliy mission');
  let html;
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
    html = await sub.common(html, 'ladder', constant.FLAG_LOOP, constant.BREAK_TEXT_LADDER, constant.ARRAY_LADDER, req);
    html = await sub.common(html, 'arena', constant.FLAG_LOOP, constant.BREAK_TEXT_ARENA, constant.ARRAY_ARENA, req);
    html = await sub.common(html, 'training', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_TRAINING, req);
    // need to test
    html = await sub.subChoice.choice(html, req);
    html = await sub.subRemains.remainsMission(html, req);
    html = await sub.subInstanceZones.instanceZones(html, req);
    html = await sub.subDraw.draw(html, req);
    // need to test
    html = await sub.common(html, 'friend-point', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_FRIEND_POINT, req);
    // need to test
    html = await sub.common(html, 'mission', constant.FLAG_LOOP, constant.BREAK_TEXT_NONE, constant.ARRAY_MISSION, req);
    html = await sub.subPresent.present(html, req);

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