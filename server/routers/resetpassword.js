const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels, sequelize) => {
  const User = ormModels.User;
  const ResetPasswordToken = ormModels.ResetPasswordToken;

  router.post("/forget-password", check("email").isEmail(), async (req, res) => {
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
        console.log("No user for email (forgot password)")
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
            expirePasswordToken: Date.now() + 36000
          },
          { where: { id: user.dataValues.id } }
        );
      } else {
        await ResetPasswordToken.create({
          id: user.dataValues.id,
          resetPasswordToken: token,
          expirePasswordToken: Date.now() + 36000
        });
      }
      console.log(`${process.env.EMAIL_ADDRESS}`);
      const transporter = nodemailer.createTransport({
          service:'gmail',
          auth:{
              user:``,
              pass: ``,
          }
      });
      const mailOptions ={
          from:'Webshop@gmail.com',
          to:`${user.dataValues.email}`,
          subject:"Reset Password",
          text:`Reset pasword\nhttp://borisvelkovski.com:3000/reset/${token}`
      }
      console.log("sending mail");
      transporter.sendMail(mailOptions, function(err,response){
          if(err){
              console.error(`Error resseting password`, err);
          } else{
              console.log(`Email res:`, response);
              res.status(200);
          }
      })
    }
  });

  router.get("/restore-password", async (req, res) => {
    
  });

  return router;
};
