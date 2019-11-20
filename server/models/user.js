const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = sequelize => {
  async function createUser(firstName, lastName, email, username, password,role) {
    const hash = await bcrypt.hash(password, saltRounds);
    if (hash) {
      const user = (await sequelize.query(`INSERT INTO users (first_name,last_name,email,username,password,role)
       VALUES('${firstName}','${lastName}','${email}','${username}','${hash}','${role}')`));
       console.log(user);
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
      const user = (await sequelize.query(`UPDATE users SET password='${hash}' WHERE id='${id}'`))[0][0];
      return user;
    }
  }
  async function findOne(id){
    const user = (await sequelize.query(`SELECT * FROM users WHERE id='${id}'`))[0][0];
    return user;
  }
  async function findOneByUsername(username){
    const user = (await sequelize.query(`SELECT * FROM users WHERE username='${username}'`))[0][0];
    return user;
  }

  async function findOneByEmail(email){
    const user = (await sequelize.query(`SELECT * FROM users WHERE email='${email}'`))[0][0];
    return user;
  }
  return { createUser, validPassword, changePassword, findOne, findOneByUsername, findOneByEmail };
};
