const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = ormModels => {
  const ormUser = ormModels.Admin;
  async function createUser(username, password, firstName, lastName, email) {
    const hash = await bcrypt.hash(password, saltRounds);
    if (hash) {
      const user = await ormUser.create({
        username,
        password: hash,
        firstName,
        lastName,
        email
      });
      return user;
    }
  }
  async function validPassword(password, hash) {
    const comp = await bcrypt.compare(password, hash);
    return comp;
  }
  return { createUser, validPassword };
};
