const express = require("express");
const crypto = require("crypto");
const transporter = require("../helpers/transporter");
const mailer = require("../helpers/mailer");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, models) => {
  const User = models.User;
  const VerifyEmailToken = models.VerifyEmailToken;
  router.post(
    "/register",
    check("email").isEmail(),
    check("username")
      .not()
      .isEmpty(),
    check("password")
      .not()
      .isEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorArray = errors.array()[0];
        const errorText =
          errorArray.msg + " in " + errorArray.param + " field!";
        return res.status(422).json({ error: errorText });
      } else
        passport.authenticate("local-signup", async function(err, user, info) {
          if (err) {
            console.log(err);
            return res.status(400).send();
          }
          if (info) {
            return res.status(422).send({ error: info });
          }
          const token = crypto.randomBytes(20).toString("hex");
          try {
            await VerifyEmailToken.create(user.id, token);
            const mailOptions = mailer.getVerifyEmailOptions(
              user.email,
              user.username,
              token
            );
            transporter.sendMail(mailOptions, function(err, response) {
              if (err) {
                console.error(`Error sending verify mail`, err);
              } else {
              }
            });
          } catch (e) {
            console.error(e);
          }
          req.logIn(user, err => {
            if (err) {
              console.log(err);
              return res.status(400).send();
            }
            req.session.user = req.user;
            return res.json();
          });
        })(req, res, next);
    }
  );

  router.post("/login", (req, res, next) => {
    try {
      passport.authenticate("local-login", function(err, user) {
        if (err) {
          console.error("Login error");
          console.error(err);
          return res.status(400).send();
        }
        req.logIn(user, err => {
          if (err) {
            console.error(err);
            return res.status(400).send();
          }
          req.session.user = req.user;
          return res.json();
        });
      })(req, res, next);
    } catch (e) {
      console.log(e);
    }
  });

  router.post(
    "/update-user-data",
    check("email").isEmail(),
    async (req, res) => {
      if (req.user) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        } else {
          const id = req.user.id;
          const email = req.body.email;
          const firstName = req.body.firstName;
          const lastName = req.body.lastName;
          try {
            if (email) {
              await User.changeEmail(id, email);
            }
            if (firstName) {
              await User.changeFirstName(id, firstName);
            }
            if (lastName) {
              await User.changeLastName(id, lastName);
            }
            return res.sendStatus(200);
          } catch (e) {
            console.error(e);
            return res.sendStatus(403);
          }
        }
      }
      return res.sendStatus(403);
    }
  );

  router.post(
    "/change-password",
    check("password")
      .not()
      .isEmpty(),
    check("newPassword")
      .not()
      .isEmpty(),
    check("newPasswordVerify")
      .not()
      .isEmpty(),
    async (req, res) => {
      const password = req.body.password;
      const newPassword = req.body.newPassword;
      const newPasswordVerify = req.body.newPasswordVerify;
      if (req.user && req.user.id) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        } else {
          const user = await User.findOne({ where: { id: req.user.id } });
          if (user) {
            const comp = await User.validPassword(password, user.password);
            if (!comp) {
              res.sendStatus(403).send("Incorrect password");
            } else {
              if (newPassword == newPasswordVerify) {
                const update = await User.changePassword(
                  req.user.id,
                  newPassword
                );
                if (update) {
                  return res.sendStatus(200);
                } else {
                  return res.sendStataus(403);
                }
              } else {
                return res
                  .sendStatus(422)
                  .send("New password is different from verified password");
              }
            }
          } else {
            return res.sendStatus(403);
          }
        }
      }
      return res.sendStatus(403);
    }
  );

  router.get("/logout", (req, res, next) => {
    req.logout();
    return res.json();
  });

  return router;
};
