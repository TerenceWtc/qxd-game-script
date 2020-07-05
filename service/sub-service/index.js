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
  benefit
}