const crypto = require("crypto");

const secretKey = crypto.randomBytes(32).toString("hex"); //generete random secretKey each time the server starts.

module.exports = { secretKey };
