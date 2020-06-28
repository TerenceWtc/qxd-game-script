/**
 * 
 */

const fetch = require('../fetch');
const util = require('../util');
const sub = require('./sub-service');

const dailyMission = async (url, req, res) => {
  // login
  let html = await fetch.get(url);
  req.account = util.getAccountName(html);
  
  // missions
  html = await sub.subExplore.explore(html, req);
  html = await sub.subLadder.ladder(html, req);
  html = await sub.subArena.arena(html, req);
  html = await sub.subTraining.training(html, req);
  html = await sub.subChoice.choice(html, req);
  html = await sub.subRemains.remainsMission(html, req);
  html = await sub.subInstanceZones.instanceZones(html, req);
  html = await sub.subDraw.draw(html, req);
  html = await sub.subMission.mission(html, req);
  html = await sub.subFriendPoint.friendPoint(html, req);

  // logout
  await sub.subLogout.logout(html, req);

  // res.status(200);
  // res.send('ok');
}

module.exports = {
  dailyMission
}