module.exports = (sequelize) => {

    async function findOne() {
        const orderedItem = (await sequelize.query(``))[0][0];
        return orderedItem;
    }

    async function findByPk(id) {
        const orderedItem = (await sequelize.query(``))[0][0];
        return orderedItem;
    }

    async function findAllByOrderPk(id) {
        const orderedItem = (await sequelize.query(`SELECT * FROM ordereditems WHERE order_id=$id;`,{
            bind:{
                id
            }
        }))[0];
        return orderedItem;
    }
    return { findOne, findByPk, findAllByOrderPk };
}