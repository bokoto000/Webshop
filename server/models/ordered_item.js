module.exports= sequelize =>{
    async function destroyByOrderId(orderId){
        const results = (await sequelize.query(`DELETE FROM orderedItems WHERE order_id='${orderId}'`))[0];
        return results;
    }
    return {destroyByOrderId};
}