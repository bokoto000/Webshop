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
        const orderedItem = (await sequelize.query(`SELECT * FROM ordereditems WHERE order_id='${id}';`))[0];
        return orderedItem;
    }

    async function create(orderId, productId, stock, orderedPrice,orderedTotal){
        const orderedItem = (await sequelize.query(`INSERT INTO ordereditems (order_id,product_id,stock,ordered_price,ordered_total)
        VALUES ('${orderId}','${productId}','${stock}','${orderedPrice}','${orderedTotal}')`))[0][0];
        return orderedItem;
    }

    async function destroyByOrderId(orderId){
        const orderedItems = (await sequelize.query(`DELETE FROM ordereditems WHERE order_id='${orderId}'`))[0][0];
        return orderedItems;
    }

    return { findOne, findByPk, findAllByOrderPk,create,destroyByOrderId };
}