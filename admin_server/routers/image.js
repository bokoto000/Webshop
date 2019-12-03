const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, models) => {

  router.get("/get-image", async (req, res, next) => {
  });

  router.post("/create-image", async (req,res,next) =>{
    
  })

  return router;
};
