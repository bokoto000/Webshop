module.exports = sequelize => {
  async function create(userId, token, date) {
    const results = (await sequelize.query(`INSERT INTO resetpasswordtokens (user_id,token,date)
    VALUES ('${userId}','${token},'${date}')`));
    return results;

  }

  async function findOne(userId) {
    const results = (await sequelize.query(`SELECT * FROM resetpasswordtokens WHERE user_id='${userId}' LIMIT 1`))[0];
    return results;

  }

  async function update(userId, token, date) {
    const results = (await sequelize.query(`UPDATE resetpasswordtokens SET token='${token}', date='${date}' WHERE user_id='${userId}'`))[0][0];
    return results;
  }

  return { create, findOne, update };
};
