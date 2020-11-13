const { bizHelper } = require('../../helper');
const logger = require('../../log');
const { bizUtil, apiUtil } = require('../../utils');

const remainsMission = async (html) => {
    logger.info(`account: ${global.qxd.name}, function remainsMission start`);
    const [label, url] = bizUtil.getLabelAndURL(['遗迹'], html);
    if (url) {
        html = await apiUtil.getUrl(label, url);
    }
    logger.info(`account: ${global.qxd.name}, function remainsMission end`);
    return await bizHelper.backToMainPage();
};

module.exports = {
    remainsMission,
};
