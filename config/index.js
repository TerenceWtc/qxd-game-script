var fs = require('fs');

try {
  var configJson = JSON.parse(fs.readFileSync(
    process.cwd() + '/account.json', 'utf-8'));
  } catch (e) {
  configJson = null;
}

var config = configJson ? configJson : require('./account.json');

exports.config = config;