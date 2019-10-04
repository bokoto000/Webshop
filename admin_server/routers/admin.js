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
  const Admin = ormModels.Admin;

  router.post("/login", (req, res, next) => {
    try {
      passport.authenticate("local-login-admin", function (err, user) {
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
    passport.authenticate("local-signup-admin", function (err, user) {
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

  router.get("/logout", (req, res, next) => {
    req.logout();
    return res.json();
  });

  router.get("/get-admins", async (req, res, next) => {
    const admins = await Admin.findAll({ attributes: ['id', 'username', 'first_name', 'last_name', 'email'] });
    return res.status(200).json(admins);
  })

  return router;
};
