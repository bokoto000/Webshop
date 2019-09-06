const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = () => {
  router.get("/user", (req, res) => {
    let user = req.user;
    if (user) {
      user.id = null;
      res.json({ user });
    } else res.status(403).send("not logged");
  });
  return router;
};
