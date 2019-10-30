module.exports = (sequelize) => {

    async function findOne() {
        const orderedItem = (await sequelize.query(``))[0][0];
        return orderedItem;
    }

    async function findByPk(id) {
        const orderedItem = (await sequelize.query(``))[0][0];
        return orderedItem;
    }

    async function findAllByPk(id) {
        const orderedItem = (await sequelize.query(`SELECT * FROM ordereditems WHERE order_id='${id}';`))[0][0];
        return orderedItem;
    }
    return { findOne, findByPk, findAll };
}