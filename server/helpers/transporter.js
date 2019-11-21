const nodemailer = require("nodemailer");
module.exports = transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `webshopdemo123@gmail.com`,
    pass: `demo1231`
  }
});
