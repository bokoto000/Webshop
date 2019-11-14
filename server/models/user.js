const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = sequelize => {
  async function createUser(
    firstName,
    lastName,
    email,
    username,
    password,
    role
  ) {
    const hash = await bcrypt.hash(password, saltRounds);
    if (hash) {
      const user = await sequelize.query(`INSERT INTO users (first_name,last_name,email,password,username,role)
      VALUES ('${firstName}','${lastName}','${email}','${password}','${username}','${role}')`);
      /*const user = await ormUser.create({
        firstName,
        lastName,
        email,
        username,
        password: hash,
        role
      });*/
      return user;
    }
  }
  async function validPassword(password, hash) {
    const comp = await bcrypt.compare(password, hash);
    return comp;
  }
  async function changePassword(id, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    if (hash) {
      const user = (await sequelize.query(`UPDATE users SET password='${hash}' WHERE id='${id}'`));
      //const user = await ormUser.update({ password: hash }, { where: { id } });
      return user;
    }
  }
  async function findByEmail(email) {
    const results = (
      await sequelize.query(`SELECT * from users WHERE email='${email}'`)
    )[0][0];
    return results[0][0];
  }
  return { createUser, validPassword, changePassword };
};
