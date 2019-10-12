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
  const PermissionRole = ormModels.PermissionRoles;
  const Permission = ormModels.Permission;

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
    try {
      await Role.destroy({ where: { id: roleId } });
      const allRoles = await UserRole.destroy({ where: { roleId } });
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

  router.get("/get-role-permissions/:id", async (req, res, next) => {
    const roleId = req.params.id;
    const permissions = await PermissionRole.findAll({ where: { roleId } });
    if (permissions) return res.json(permissions);
    else return res.sendStatus(403);
  });

  router.post("/assign-role", async (req, res, next) => {
    const adminId = req.body.userId;
    const roleId = req.body.roleId;
    const admin = await Admin.findOne({ where: { id: adminId } });
    const hasUserRole = await UserRole.findOne({
      where: { userId: adminId, roleId: roleId }
    });
    if (hasUserRole) {
      return res.status(403).send({ error: "User already has that role" });
    }
    if (admin && !hasUserRole) {
      const userRole = await UserRole.create({ userId: adminId, roleId });
      if (userRole) {
        return res.sendStatus(200);
      } else {
        return res
          .status(403)
          .send({ error: "There was an error creating the user role" });
      }
    }
  });

  router.post("/cancel-role", async (req, res, next) => {
    const adminId = req.body.userId;
    const roleId = req.body.roleId;
    const admin = await Admin.findOne({ where: { id: adminId } });
    const hasUserRole = await UserRole.findOne({
      where: { userId: adminId, roleId: roleId }
    });
    if (hasUserRole && admin) {
      const role = await UserRole.destroy({
        where: { userId: adminId, roleId: roleId }
      });
      if (role) return res.sendStatus(200);
      else return res.send(403);
    }
    return res.send(401);
  });

  router.post("/grant-permission", async (req, res, next) => {
    const roleId = req.body.roleId;
    const perms = req.body.perms;
    const role = await Role.findOne({ where: { id: roleId } });
    const permsLength = perms.length;
    let hasErrors = 0;
    for (let i = 0; i < permsLength; i++) {
      const permId = perms[i].id;
      const perm = await Permission.findOne({ where: { id: permId } });
      const permRole = await PermissionRole.findOne({
        where: { permissionId:permId, roleId }
      });
      if (role && perm) {
        if (!permRole && perms[i].isTicked == true)
          await PermissionRole.create({
            roleId,
            permissionId: permId
          });
        if (permRole && !perms[i].isTicked ) {
          await PermissionRole.destroy({
            where: {
              roleId,
              permissionId: permId
            }
          });
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
