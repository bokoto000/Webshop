module.exports = (sequelize) => {

    async function findOne(id) {
        const user = (await sequelize.query(`SELECT id,username,email,first_name,last_name FROM users WHERE id='${id}'`))[0][0];
        return user;
    }
    return { findOne };
}