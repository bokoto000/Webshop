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
  router.post("/create-permission", (req, res, next) => {
   return res.send(200);
  });
  

  return router;
};
