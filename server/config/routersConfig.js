module.exports = (app, ormModels, passport,sequelize) => {
    app.use('/product',require('../routers/product') (passport, ormModels,sequelize))
    app.use('/user',require('../routers/user') (passport, ormModels));
    app.use('/cart',require('../routers/cart') (passport, ormModels,sequelize));
    app.use('/resetpassword', require('../routers/resetpassword')(passport,ormModels,sequelize));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, ormModels));
}