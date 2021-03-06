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
      const user = await sequelize.query(
        `INSERT INTO users (first_name,last_name,email,username,password,role)
       VALUES($firstName,$lastName,$email,$username,$hash,$role)`,
        {
          bind: { firstName, lastName, hash, email, role, username }
        }
      );
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
      const user = (
        await sequelize.query(`UPDATE users SET password=$hash WHERE id=$id`, {
          bind: { hash, id }
        })
      )[0][0];
      return user;
    }
  }

  async function findOne(id) {
    const user = (
      await sequelize.query(`SELECT * FROM users WHERE id=$id`, {
        bind: { id }
      })
    )[0][0];
    return user;
  }

  async function findOneByUsername(username) {
    const user = (
      await sequelize.query(`SELECT * FROM users WHERE username=$username`, {
        bind: { username }
      })
    )[0][0];
    return user;
  }

  async function findOneByEmail(email) {
    const user = (
      await sequelize.query(`SELECT * FROM users WHERE email=$email`, {
        bind: { email }
      })
    )[0][0];
    return user;
  }

  async function changeFirstName(id, firstName) {
    const user = (
      await sequelize.query(
        `UPDATE users SET first_name=$firstName WHERE id=$id`,
        {
          bind: {id, firstName}
        }
      )
    )[0][0];
    return user;
  }

  async function changeLastName(id, lastName) {
    const user = (
      await sequelize.query(
        `UPDATE users SET last_name=$lastName WHERE id=$id`,
        {
          bind: {id, lastName}
        }
      )
    )[0][0];
    return user;
  }

  async function changeEmail(id, email) {
    const user = await sequelize.query(
      `UPDATE users SET email=$email WHERE id=$id`,
      {
        bind: {id, email}
      }
    );
  }

  async function updateRole(userId, role) {
    const user = await sequelize.query(
      `UPDATE users SET role=$role WHERE id = $userId`,
      {
        bind: {userId, role}
      }
    );
  }

  return {
    updateRole,
    changeFirstName,
    changeLastName,
    changeEmail,
    createUser,
    validPassword,
    changePassword,
    findOne,
    findOneByUsername,
    findOneByEmail
  };
};
