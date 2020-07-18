/*global process*/
var fs = require('fs');

try {
  var settingsJson = JSON.parse(fs.readFileSync(process.cwd() + '/settings.json', 'utf-8'));
} catch (e) {
  settingsJson = null;
}

const settings = settingsJson ? settingsJson : require('./settings.json');
const constant = require('./constant.json');
const bank = require('./bank.json');

module.exports = {
  settings,
  constant,
  bank
}