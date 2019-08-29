const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
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
      if (!errors.isEmpty()) {
        console.error("Validation errors");
        console.log(req.body.email);
        return res.status(422).json({ errors: errors.array() });
      } else {
        const user = await User.findOne({
          where: {
            email: req.body.email
          }
        });
        if (!user) {
          console.log("No user for email (forgot password)");
          return res.sendStatus(422);
        }
        const token = crypto.randomBytes(20).toString("hex");
        const resPass = await ResetPasswordToken.findOne({
          where: {
            id: user.dataValues.id
          }
        });
        if (resPass) {
          await ResetPasswordToken.update(
            {
              resetPasswordToken: token,
              expirePasswordToken: Date.now() + 3600000
            },
            { where: { id: user.dataValues.id } }
          );
        } else {
          await ResetPasswordToken.create({
            id: user.dataValues.id,
            resetPasswordToken: token,
            expirePasswordToken: Date.now() + 3600000
          });
        }
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: ``,
              pass: ``
            }
          });
          const mailOptions = {
            from: "Webshop@gmail.com",
            to: `${user.dataValues.email}`,
            subject: "Reset Password",
            text: `Reset pasword\nhttp://borisvelkovski.com:3000/reset/${token}`
          };
          console.log("sending mail");
          transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
              console.error(`Error resseting password`, err);
              res.sendStatus(403);
            } else {
              console.log(`Email res:`, response);
              res.status(200);
            }
          });
        } catch (e) {
          console.log("err");
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
          where: { expirePasswordToken: {[Op.gt]:Date.now().toString()} }
        });
        const userId = resToken.dataValues.id;
        const user = await User.findOne({ where: { id: userId } });
        console.log(user);
        if (!user) {
          return done(null, false, "User doesnt exist");
        } else {
          const hash = await bcrypt.hash(req.body.password, saltRounds);
          if (hash) {
            const user = await User.update(
              { password: hash },
              { where: { id: userId } }
            );
            if(user){
              return res.sendStatus(200);
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