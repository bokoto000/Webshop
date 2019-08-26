const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels) => {
  router.post("/register", check("email").isEmail(),
  check("username").not().isEmpty(),
  check("passowrd").not().isEmpty(), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else
      passport.authenticate("local-signup", function(err, user) {
        if (err) {
          console.log(err);
          return res.status(400).send();
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
  });

  router.post("/login", (req, res, next) => {
    try {
      passport.authenticate("local-login", function(err, user) {
        if (err) {
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

  router.get("/logout", (req, res, next) => {
    req.logout();
    return res.json();
  });

  return router;
};
