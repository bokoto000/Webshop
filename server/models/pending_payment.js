module.exports = sequelize =>{

    async function create(orderId,paymentId,total){
        const pendingPayment = (await sequelize.query(`INSERT INTO pendingpayments (order_id,payment_id,total) 
        VALUES('${orderId}','${paymentId}','${total}')`))[0][0];
        return pendingPayment;;
    }

    async function findOne(paymentId){
        const pendingPayment = (await sequelize.query(`SELECT * FROM pendingpayments WHERE payment_id='${paymentId}'`))[0][0];
        return pendingPayment;
    }

    async function destroy(paymentId){
        const pendingPayment  = (await sequelize.query(`DELETE FROM pendingpayments WHERE payment_id='${paymentId}'`))[0];
        return pendingPayment;
    }

    return {create,findOne,destroy};
}