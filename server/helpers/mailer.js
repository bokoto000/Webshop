module.exports = {
  getChangePasswordMailOptions: function(toEmail, username, token) {
    return (mailOptions = {
      from: "Webshop@gmail.com",
      to: `${toEmail}`,
      subject: "Reset Password",
      text: `Hello ${username},\nReset pasword\nhttp://localhost:3000/restorepassword/${token}`
    });
  },
  getVerifyEmailOptions: function(toEmail, username, token) {
    return (mailOptions = {
      from: "Webshop@gmail.com",
      to: `${toEmail}`,
      subject: "Verify Email",
      text: `Hello ${username},\nVerify your email\nhttp://localhost:3000/verified-email/${token}`
    });
  }
};
