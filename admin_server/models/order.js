module.exports = (sequelize) => {

    async function findByPk(id) {
        const user = (await sequelize.query(`SELECT * FROM orders WHERE id='${id}''`))[0][0];
        return user;
    }

    async function findAll() {
        const user = (await sequelize.query(`SELECT * FROM orders`))[0][0];
        return user;
    }
    return { findOne, findByPk, findAll };
}