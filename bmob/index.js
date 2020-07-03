/* global process*/
const log4js = require('../config/log');
const logger = log4js.getLogger(process.env.NODE_ENV || 'prod');

const Bmob = require('../hydrogen-js-sdk-master/hydrogen-js-sdk-master/src/lib/app.js');

Bmob.initialize("13b3f548ea74ec76", "654321");

const query = Bmob.Query('account');

const findBmob = async (field, value) => {
  query.equalTo(field, "==", value);
  return await query.find().then(res => {
    return res.length > 0;
  }).catch(err => {
    if (err.code == 'ECONNRESET') {
      logger.error('Bmob connect failed');
    } else {
      logger.error(err.code)
    }
  });
}

const saveBmob = async (data) => {
  let result = await findBmob('accountId', data.accountId);
  logger.info(result);
  if (result) {
    logger.info(`account is exist: ${data.accountId}, ${data.account}`);
    return;
  }
  query.set('accountId', data.accountId);
  query.set('name', data.account);
  // query.set('bookmark', data.bookmark);
  await query.save().then(res => {
    console.log(res)
  }).catch(err => {
    if (err.code == 'ECONNRESET') {
      logger.error('Bmob connect failed');
    } else {
      logger.error(err.code)
    }
  })
}

module.exports = {
  findBmob,
  saveBmob
}