const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const transporter = require("../helpers/transporter");
const mailer = require("../helpers/mailer.js");
const { check, validationResult } = require("express-validator");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const Op = Sequelize.Op;
const saltRounds = 10;

module.exports = models => {
  const User = models.User;
  const ResetPasswordToken = models.ResetPasswordToken;

  router.post(
    "/forget-password",
    check("email").isEmail(),
    async (req, res) => {
      const errors = validationResult(req);
      let user = null;
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        user = await User.findOneByEmail(req.body.email);
        if (!user) {
          return res.sendStatus(422);
        }
        const token = crypto.randomBytes(20).toString("hex");
        const resPass = await ResetPasswordToken.findOne(user.id);
        if (resPass) {
          await ResetPasswordToken.update(user.id, token, Date.now() + 3600000);
        } else {
          await ResetPasswordToken.create(user.id, token, Date.now() + 3600000);
        }
        try {
          const mailOptions = mailer.getChangePasswordMailOptions(
            user.email,
            user.username,
            token
          );
          transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
              console.error(`Error resseting password`, err);
              return res.sendStatus(403);
            } else {
              return res.sendStatus(200);
            }
          });
        } catch (e) {
          console.error(e);
          res.sendStatus(403);
        }
      }
    }
  );

  router.get("/restore-password/:token", async (req, res) => {
    const token = req.params.token;
    const resPass = await ResetPasswordToken.findOneValidToken(token);
    if (resPass) {
      return res.sendStatus(200);
    } else return res.sendStatus(403);
  });

  router.post(
    "/change-password",
    check("token")
      .not()
      .isEmpty(),
    check("password")
      .not()
      .isEmpty(),
    check("verifyPassword")
      .not()
      .isEmpty(),
    async (req, res, next) => {
      if (req.body.password == req.body.verifyPassword) {
        const token = req.body.token;
        const resToken = await ResetPasswordToken.findOneValidToken(token);
        const userId = resToken.id;
        const user = await User.findOne(userId);
        if (!user) {
          return done(null, false, "User doesnt exist");
        } else {
          try {
            await User.changePassword(userId, req.body.password);
            return res.sendStatus(200);
          } catch (e) {
            console.error(e);
            return res.sendStatus(403);
          }
        }
      } else {
        res.sendStatus(422);
      }
    }
  );

  return router;
};
