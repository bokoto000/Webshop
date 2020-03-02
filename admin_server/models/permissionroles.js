module.exports = sequelize => {
  async function findAll() {
    const permissions = (
      await sequelize.query(`SELECT * FROM permissionroles`)
    )[0];
    return permissions;
  }

  async function findOne(permId, roleId) {
    const perm = (
      await sequelize.query(
        `SELECT * FROM permissionroles
         WHERE permission_id=$permId AND role_id=$roleId`,
        {
          bind: {
            permId,
            roleId
          }
        }
      )
    )[0][0];
    return perm;
  }

  async function findAllByRole(id) {
    const permissions = (
      await sequelize.query(
        `SELECT * FROM permissionroles
         WHERE role_id=$id`,
        {
          bind: {
            id
          }
        }
      )
    )[0];
    return permissions;
  }

  async function create(permId, roleId) {
    const perms = await sequelize.query(
      `INSERT INTO permissionroles (permission_id, role_id)
         VALUES($permId,$roleId)`,
      {
        bind: {
          permId,
          roleId
        }
      }
    );
    return perms;
  }

  async function deletePermission(permId, roleId) {
    const perm = await sequelize.query(
      `DELETE FROM permissionroles WHERE 
        permission_id=$permId AND role_id=$roleId`,
      {
        bind: {
          permId,
          roleId
        }
      }
    );
    return perm;
  }

  return { findAll, findOne, findAllByRole, create, deletePermission };
};
