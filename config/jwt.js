const crypto = require("crypto");

const secretKey = crypto.randomBytes(32).toString("hex");//generete random secretKey.

module.exports = { secretKey };