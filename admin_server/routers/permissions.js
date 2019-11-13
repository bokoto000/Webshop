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
  const Permission = models.Permission;

  router.post("/create-permission", async (req, res, next) => {
    const name = req.body.name;
    const permission = req.body.permission;
    try{
    const newPerm = await Permission.create(name, permission );
    } catch (e){
      console.error(e);
      return res.status(403).json({error:"Проблем при създаването на роля"});
    }
    return res.sendStatus(200);
  });

  router.get("/get-permissions", async (req, res, next) => {
    const permissions = await Permission.findAll();
    return res.json(permissions);
  });

  return router;
};
