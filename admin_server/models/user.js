const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = (sequelize) => {
    async function createUser(username, password, email, firstName, lastName) {
        const hash = await bcrypt.hash(password, saltRounds);
        if (hash) {
            try {
                const query = await sequelize.query(`INSERT INTO admins (username,password,email,first_name,last_name)
             VALUES ('${username}','${hash}','${email}','${firstName}','${lastName}') `);
                if (query) {
                    const user = await findOne(username);
                    return user;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        }
    }

    async function validPassword(username, password) {
        const hash = (await sequelize.query(`SELECT password FROM admins WHERE admins.username='${username}'`))[0][0].password;
        const comp = await bcrypt.compare(password, hash);
        return comp;
    }

    async function findOne(username) {
        const user = (await sequelize.query(`SELECT id,username,email,first_name,last_name FROM admins WHERE username='${username}'`))[0][0];
        return user;
    }

    async function findByPk(id) {
        const user = (await sequelize.query(`SELECT id,username,email,first_name,last_name FROM admins WHERE id='${id}'`))[0][0];
        return user;
    }

    async function findAll() {
        const user = (await sequelize.query(`SELECT id,username,email,first_name,last_name FROM admins`))[0][0];
        return user;
    }
    return { createUser, validPassword, findOne, findByPk, findAll };
}