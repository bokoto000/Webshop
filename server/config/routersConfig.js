module.exports = (app, ormModels, passport,sequelize, models) => {
    app.use('/product',require('../routers/product') (passport, models,sequelize))
    app.use('/user',require('../routers/user') (passport, models, models));
    app.use('/cart',require('../routers/cart') (passport, models,sequelize));
    app.use('/order',require('../routers/order') (passport, models,sequelize));
    app.use('/resetpassword', require('../routers/resetpassword')(passport,models,sequelize));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, models));
    app.use('/status', require('../routers/status')(passport, models));
    app.use('/paypal', require('../routers/paypal')(sequelize, models));
}