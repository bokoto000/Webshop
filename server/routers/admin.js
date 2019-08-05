const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels) => {
  //Вход в админ панела
  router.post("/login", (req, res, next) => {
    console.log("Admin Login");
    try {
      passport.authenticate("local-login-admin", function(err, user) {
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
      console.log("Login route");
    }
  });

  router.post("/register", (req, res, next) => {
    passport.authenticate("local-signup-admin", function(err, user) {
      if (err) {
        return res.status(400).send();
      }
      req.logIn(user, err => {
        if (err) {
          return res.status(400).send();
        }
        req.session.user = req.user;
        return res.json();
      });
    })(req, res, next);
  });

  //Изход от админ панела
  router.post("/logout", (req, res, next) => {
    req.logout();
    return res.json();
  });

  return router;
};
