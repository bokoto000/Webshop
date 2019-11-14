const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const { check, validationResult } = require("express-validator");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const Op = Sequelize.Op;
const saltRounds = 10;

module.exports = (passport, ormModels, sequelize) => {
  const User = ormModels.User;
  const ResetPasswordToken = ormModels.ResetPasswordToken;

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
        const resPass = await ResetPasswordToken.findOne(user.dataValues.id);
        if (resPass) {
          await ResetPasswordToken.update(user.id, token);
        } else {
          await ResetPasswordToken.create(user.id, token);
        }
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: `webshopdemo123@gmail.com`,
              pass: `demo1231`
            }
          });
          const mailOptions = {
            from: "Webshop@gmail.com",
            to: `${user.dataValues.email}`,
            subject: "Reset Password",
            text: `Hello ${user.username},\nReset pasword\nhttp://borisvelkovski.com:3000/restorepassword/${token}`
          };
          transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
              console.error(`Error resseting password`, err);
              res.sendStatus(403);
            } else {
              res.sendStatus(200);
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
    const resPass = await ResetPasswordToken.findOne({
      where: {
        resetPasswordToken: token,
        expirePasswordToken: { [Op.gt]: Date.now().toString() }
      }
    });
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
        const resToken = await ResetPasswordToken.findOne({
          where: { expirePasswordToken: { [Op.gt]: Date.now().toString() } }
        });
        const userId = resToken.dataValues.id;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
          return done(null, false, "User doesnt exist");
        } else {
          const hash = await bcrypt.hash(req.body.password, saltRounds);
          if (hash) {
            const user = await User.update(
              { password: hash },
              { where: { id: userId } }
            );
            if (user) {
              return res.sendStatus(200);
            } else {
              return res.sendStatus(403);
            }
          }
        }
      } else {
        res.sendStatus(422);
      }
    }
  );

  return router;
};
