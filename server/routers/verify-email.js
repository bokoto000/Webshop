const express = require("express");
const router = express.Router();

module.exports = models => {
  const VerifyEmailToken = models.VerifyEmailToken;
  const User = models.User;
  router.post("/verify-email/:token", async (req, res) => {
    const token = req.params.token;
    const verifyEmail = await VerifyEmailToken.findOne(token);
    let user;
    if (verifyEmail) user = await User.findOne(verifyEmail.user_id);
    if (user) {
      try {
        console.log(user);
        await User.updateRole(user.id, "User");
        await VerifyEmailToken.destroy(token);
        return res.sendStatus(200);
      } catch (e) {
        console.error(e);
        return res
          .status(403)
          .json({ error: "There was a problem verifying your email!" });
      }
    } else {
      return res.status(403).json({ error: "Invalid verify email token!" });
    }
    return res.sendStatus(200);
  });
  return router;
};
