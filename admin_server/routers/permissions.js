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
  const Permission = ormModels.Permission;
  const PermissionRoles = 

  router.post("/create-permission", async (req, res, next) => {
    const name = req.body.name;
    const permission = req.body.permission;
    const newPerm = await Permission.create({ name, permission });
    if (!newPerm) {
      return res.send(403);
    }
    return res.send(200);
  });

  router.get("/get-permissions", async (req, res, next) => {
    const permissions = await Permission.findAll();
    return res.json(permissions);
  });

  return router;
};
