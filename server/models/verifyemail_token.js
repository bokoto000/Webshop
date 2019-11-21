module.exports = sequelize => {
  async function create(userId, token) {
    const results = await sequelize.query(`INSERT INTO verifyemailtokens (user_id, token)
        VALUES ('${userId}', '${token}') `);
    return results;
  }

  async function findOne(token) {
    const results = (
      await sequelize.query(
        `SELECT * FROM verifyemailtokens WHERE token='${token}' LIMIT 1`
      )
    )[0][0];
    return results;
  }

  async function destroy(token) {
    const results = (
      await sequelize.query(
        `DELETE FROM verifyemailtokens WHERE token='${token}'`
      )
    )[0][0];
    return results;
  }

  return { create, findOne, destroy };
};
