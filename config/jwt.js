const crypto = require("crypto");

// const secretKey = crypto.randomBytes(32).toString("hex"); //generete random secretKey each time the server starts.
const secretKey = "d8e4e3";
module.exports = { secretKey };
