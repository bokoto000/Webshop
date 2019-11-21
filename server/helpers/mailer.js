module.exports = {
  getChangePasswordMailOptions: function(toEmail, username, token) {
    return (mailOptions = {
      from: "Webshop@gmail.com",
      to: `${toEmail}`,
      subject: "Reset Password",
      text: `Hello ${username},\nReset pasword\nhttp://borisvelkovski.com:3000/restorepassword/${token}`
    });
  }
};
