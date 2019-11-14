const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels, models) => {
  const Role = models.Role;
  const UserRole = models.UserRole;
  const Admin = models.Admin;
  const PermissionRole = models.PermissionRole;
  
  router.post("/create-role", async (req, res, next) => {
    const roleName = req.body.roleName;
    try {
      await Role.create(roleName);
    } catch (e) {
      console.error(e);
      return res.status(401).json({ error: "Ролята вече съществува" });
    }
    return res.sendStatus(200);
  });

  router.post("/delete-role", async (req, res, next) => {
    const roleId = req.body.roleId;
    try {
      await Role.deleteById(roleId);
      await UserRole.deleteAllById(roleId);
      await PermissionRoles.deleteAllByRole(roleId);
    } catch (e) {
      return res.sendStatus(403);
    }
    return res.sendStatus(200);
  });

  router.get("/get-roles", async (req, res, next) => {
    const roles = await Role.findAll();
    if (roles) return res.json(roles);
    else return res.sendStatus(403);
  });

  router.get("/get-role-permissions/:id", async (req, res, next) => {
    const roleId = req.params.id;
    const permissions = await PermissionRole.findAllByRole(roleId);
    if (permissions) return res.json(permissions);
    else return res.sendStatus(403);
  });

  router.post("/assign-role", async (req, res, next) => {
    const adminId = req.body.userId;
    const roleId = req.body.roleId;
    const admin = await Admin.findByPk(adminId);
    const hasUserRole = await UserRole.findOne(adminId, roleId);
    if (hasUserRole) {
      return res.status(403).send({ error: "User already has that role" });
    }
    if (admin && !hasUserRole) {
      try {
        const userRole = await UserRole.create(adminId, roleId);
        return res.sendStatus(200);
      } catch (e) {
        console.error(e);

        return res
          .status(403)
          .send({ error: "There was an error creating the user role" });
      }
    }
  });

  router.post("/cancel-role", async (req, res, next) => {
    const adminId = req.body.userId;
    const roleId = req.body.roleId;
    const admin = await Admin.findByPk(adminId);
    const hasUserRole = await UserRole.findOne(adminId, roleId);
    if (hasUserRole && admin) {
      const role = await UserRole.deleteOne(adminId, roleId);
      if (role) return res.sendStatus(200);
      else return res.send(403);
    }
    return res.send(401);
  });

  router.post("/grant-permission", async (req, res, next) => {
    const roleId = req.body.roleId;
    const perms = req.body.perms;
    const role = await Role.findOne(roleId);
    const permsLength = perms.length;
    let hasErrors = 0;
    for (let i = 0; i < permsLength; i++) {
      const permId = perms[i].id;
      const permRole = await PermissionRole.findOne(permId, roleId);
      if (role) {
        if (!permRole && perms[i].isTicked == true)
          await PermissionRole.create(permId, roleId);
        if (permRole && !perms[i].isTicked) {
          await PermissionRole.deletePermission(permId, roleId);
        }
      } else {
        hasErrors++;
      }
    }
    if (hasErrors == 0) return res.sendStatus(200);
    else
      return res.status(200).send({
        error: `There were a few permissions that could not be given`
      });
  });

  return router;
};
