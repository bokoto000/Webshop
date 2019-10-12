const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels, sequelize) => {
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
    const admins = await Admin.findAll({
      attributes: ["id", "username", "first_name", "last_name", "email"]
    });
    return res.status(200).json(admins);
  });

  router.get("/get-admins-with-roles", async (req, res, next) => {
    const admins = (await sequelize.query(`SELECT "userroles".*,"roles".*,"admins".*
            FROM (SELECT "admins"."id",
            "admins"."first_name" as "firstName",
            "admins"."last_name" as "lastName",
            "admins"."email" as "email",
            "admins"."username" as "username"
                  FROM "admins") AS "admins"
                   LEFT OUTER JOIN "userroles" AS "userroles" ON "admins"."id" = "userroles"."user_id" 
                   LEFT OUTER JOIN "roles" AS "roles" ON "userroles"."role_id" = "roles"."id"
                   ;`))[0];
    if (admins) return res.json(admins);
    else
      return res
        .status(403)
        .send({ error: "There was an error in retrieving admins" });
  });

  router.get("/get-admin/:id", async (req, res, next) => {
    const id = req.params.id;
    let admin = (await sequelize.query(`
    SELECT "admins"."id",
    "admins"."first_name" as "firstName",
    "admins"."last_name" as "lastName",
    "admins"."email" as "email",
    "admins"."username" as "username"
          FROM "admins" WHERE "admins"."id"=${id} LIMIT 1;`))[0][0];
    admin.roles = [];
    let roles = (await sequelize.query(`
    SELECT "userroles".*,"roles".* FROM
    ( SELECT "userroles".* FROM "userroles" WHERE "userroles"."user_id"=${id}) AS "userroles"
    LEFT OUTER JOIN "roles" AS "roles" ON "userroles"."role_id" = "roles"."id";`))[0];
    admin.roles = roles;
    if (admin) return res.status(200).json(admin);
    return res.sendStatus(403);
  });

  return router;
};
