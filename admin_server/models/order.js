module.exports = (sequelize) => {

    async function findByPk(id) {
        const order = (await sequelize.query(`SELECT * FROM orders WHERE id='${id}''`))[0][0];
        return order;
    }

    async function findAll() {
        const order = (await sequelize.query(`SELECT * FROM orders`))[0][0];
        return order;
    }
    return { findOne, findByPk, findAll };
}