module.exports = sequelize => {
  async function create(id) {
    const results = (
      await sequelize.query(`INSERT INTO carts (user_id) VALUES ('${id}')`)
    )[0];
    return results;
  }

  async function findOneByUserId(id) {
    const results = (
      await sequelize.query(`SELECT * FROM carts WHERE user_id='${id}'`)
    )[0][0];
    return results;
  }

  async function destroy(id) {
    const results = (
      await sequelize.query(`DELETE FROM carts WHERE user_id='${id}'`)
    )[0];
    return results;
  }

  return { create, findOneByUserId, destroy };
};
