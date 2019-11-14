module.exports = sequelize => {
  async function findOneByUserId(userId) {
    const results = (
      await sequelize.query(
        `SELECT * FROM resetpasswordtokens WHERE id='${userId}'`
      )
    )[0][0];
    return results;
  }

  async function update(userId, token) {
    const results = (
      await sequelize.query(
        `UPDATE resetpasswordtokens SET token='${token}, expire='${Date.now() +
          3600000}' WHERE id='${userId}'`
      )
    )[0][0];
    return results;
  }

  async function create(userId, token) {
    const results = await sequelize.query(
      `INSERT INTO resetpasswordtokens (id,token,expire) VALUES('${userId}','${token}','${Date.now() +
        3600000}')`
    )[0][0];
    return results;
  }

  return { findOneByUserId, update, create };
};
