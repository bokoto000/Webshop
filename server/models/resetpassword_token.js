module.exports = sequelize => {
  async function create(userId, token, date) {
    const results = await sequelize.query(
      `INSERT INTO resetpasswordtokens (id,token,expire)
    VALUES ($userId,$token,$date)`,
      {
        bind: { userId, token, date }
      }
    );
    return results;
  }

  async function findOne(userId) {
    const results = (
      await sequelize.query(
        `SELECT * FROM resetpasswordtokens
     WHERE id=$userId LIMIT 1`,
        {
          bind: { userId }
        }
      )
    )[0];
    return results;
  }

  async function update(userId, token, date) {
    const results = (
      await sequelize.query(
        `UPDATE resetpasswordtokens SET token=$token, 
    expire=$date WHERE id=$userId`,
        {
          bind: { token, date, userId }
        }
      )
    )[0][0];
    return results;
  }

  async function findOneValidToken(token) {
    const results = (
      await sequelize.query(
        `SELECT * FROM resetpasswordtokens WHERE token = $token
     AND expire>='${Date.now().toString()}' LIMIT 1`,
        {
          bind: { token }
        }
      )
    )[0][0];
    return results;
  }

  return { create, findOne, update, findOneValidToken };
};
