const crypto = require('crypto-js');

const config = require('../config');

const encrypt = (plaintext) => {
    return crypto.AES.encrypt(plaintext, config.salt).toString();
};

const decrypt = (ciphertext) => {
    return crypto.AES.decrypt(ciphertext, config.salt).toString(crypto.enc.Utf8);
};

module.exports = {
    encrypt,
    decrypt,
};
