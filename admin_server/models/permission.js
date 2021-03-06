module.exports = sequelize => {
  async function create(name, permission) {
    console.log(name, permission);
    const perm = await sequelize.query(
      `INSERT INTO permissions ("name","permission")
         VALUES ($name,$permission)`,
      {
        bind: {
          name,
          permission
        }
      }
    );
    return perm[0];
  }

  async function findOne(id) {
    const perm = (
      await sequelize.query(`SELECT * FROM permissions WHERE id=$id`, {
        bind: {
          id
        }
      })
    )[0][0];
  }

  async function findAll() {
    const results = (await sequelize.query(`SELECT * FROM permissions`))[0];
    return results;
  }

  return { create, findAll, findOne };
};
