const subChoice = require('./choice');
const subLogout = require('./logout');
const subRemains = require('./remains');
const subInstanceZones = require('./instance-zones');
const subDraw = require('./draw');
const subPresent = require('./present');
const common = require('./common').common;
const strongHold = require('./strong-hold');
const battle = require('./battle');
const donate = require('./donate');
const benefit = require('./benefit');
const event05 = require('./event-05');
const commonEvent = require('./common-event').commonEvent;

module.exports = {
  subChoice,
  subLogout,
  subRemains,
  subInstanceZones,
  subDraw,
  subPresent,
  common,
  strongHold,
  battle,
  donate,
  benefit,
  event05,
  commonEvent
}