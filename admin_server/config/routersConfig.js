module.exports = (app, ormModels, passport, sequelize) => {
    app.use('/admin', require('../routers/admin')(passport, ormModels));
    app.use('/product',require('../routers/product') (passport, ormModels, sequelize));
    app.use('/tag',require('../routers/tag') (passport, ormModels));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, ormModels));
}