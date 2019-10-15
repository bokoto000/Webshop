module.exports = (app, ormModels, passport,sequelize, models) => {
    app.use('/product',require('../routers/product') (passport, ormModels,sequelize))
    app.use('/user',require('../routers/user') (passport, ormModels, models));
    app.use('/cart',require('../routers/cart') (passport, ormModels,sequelize));
    app.use('/order',require('../routers/order') (passport, ormModels,sequelize));
    app.use('/resetpassword', require('../routers/resetpassword')(passport,ormModels,sequelize));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, ormModels));
    app.use('/status', require('../routers/status')(passport, ormModels));
    app.use('/paypal', require('../routers/paypal')(sequelize, ormModels));
}