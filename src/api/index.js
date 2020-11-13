const fetch = require('./fetch');
const logger = require('../log');

const getApi = (url) => new Promise((resolve, reject) => {
    fetch.instance.get(url).then((httpResponse) => {
        resolve(httpResponse);
    }).catch((err) => {
        logger.error('get api error:', err);
        reject(err);
    });
});

const postApi = (data, url) => new Promise((resolve, reject) => {
    fetch.instance.post(url, data).then((httpResponse) => {
        resolve(httpResponse);
    }).catch((err) => {
        logger.error('post api error:', err);
        reject(err);
    });
});

module.exports = {
    getApi,
    postApi,
};
