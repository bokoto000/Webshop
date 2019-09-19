const express = require("express");
const router = express.Router();


module.exports = () => {
  router.get("/get-status", (req, res) => {
    return res.sendStatus(200);
  });
  return router;
};
