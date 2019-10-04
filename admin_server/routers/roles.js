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

  const Role = ormModels.Role;
  const UserRole = ormModels.UserRole;
  const Admin = ormModels.Admin;

  router.post("/create-role", async (req, res, next) => {
    const roleName = req.body.roleName;
    try {
      await Role.create({ role: roleName });
    } catch (e) {
      return res.sendStatus(403);
    }
    return res.sendStatus(200);
  });

  router.post("/delete-role", async (req, res, next) => {
    const roleId = req.body.roleId;
    console.log("TEST");
    try {
      await Role.destroy({ where:{id: roleId }});
      const allRoles = await UserRole.destroy({where:{roleId}});
      console.log("test");
    } catch (e) {
      return res.sendStatus(403);
    }
    return res.sendStatus(200);
  });

  router.get("/get-roles", async (req, res, next) => {
    const roles = await Role.findAll({});
    if (roles) return res.json(roles);
    else return res.sendStatus(403);
  });

  router.post("/assign-role", async (req, res, next) => {
    const adminId = req.body.userId;
    const roleId = req.body.roleId;
    const admin = await Admin.findOne({ where: { id: adminId } });
    const hasUserRole = await UserRole.findOne({where:{userId:adminId,roleId:roleId}});
    if(hasUserRole){
      return res.status(403).send({error:"Error"})
    }
    if (admin&&!hasUserRole) {
      const userRole = await UserRole.create({ userId: adminId, roleId })
      if (userRole) {
        return res.sendStatus(200);
      }
      else {
        return res.status(403).send({ error: "Error" });
      }
    }
  })


  return router;
};
