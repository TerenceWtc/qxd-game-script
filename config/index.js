/*global process*/
var fs = require('fs');

try {
  var accountJson = JSON.parse(fs.readFileSync(process.cwd() + '/account.json', 'utf-8'));
} catch (e) {
  accountJson = null;
}

const account = accountJson ? accountJson : require('./account.json');
const constant = require('./constant.json');

module.exports = {
  account,
  constant
}