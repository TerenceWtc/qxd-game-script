/* global process*/
const config = require('../config');
const log4js = require('../config/log');
const logger = log4js.getLogger(process.env.NODE_ENV || 'default');

const Bmob = require('../hydrogen-js-sdk-master/hydrogen-js-sdk-master/src/lib/app.js');

Bmob.initialize(config.constant.BMOB_SECRET_KEY, config.constant.BMOB_API_SECRET);

const queryAccount = Bmob.Query('account');
const queryVersion = Bmob.Query('version');

const findBmob = async (table, field, value) => {
  let query;
  if (table == 'account') {
    query = queryAccount;
  } else if (table == 'version') {
    query = queryVersion;
  }
  query.equalTo(field, "==", value);
  return await query.find().then(res => {
    return res.length > 0;
  }).catch(err => {
    if (err.code == 'ECONNRESET') {
      logger.error('Bmob connect failed');
    } else {
      logger.error(err.code + err.message);
    }
  });
}

const saveBmob = async (data) => {
  let result = await findBmob('account', 'accountId', data.accountId);
  logger.info(result);
  if (result) {
    logger.info(`account is exist: ${data.accountId}, ${data.account}`);
    return;
  }
  queryAccount.set('accountId', data.accountId);
  queryAccount.set('name', data.account);
  await queryAccount.save().then(res => {
    console.log(res)
  }).catch(err => {
    if (err.code == 'ECONNRESET') {
      logger.error('Bmob connect failed');
    } else {
      logger.error(err.code + err.message);
    }
  })
}

module.exports = {
  findBmob,
  saveBmob
}