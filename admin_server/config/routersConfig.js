module.exports = (app, ormModels, passport, sequelize, models) => {
    app.use('/admin', require('../routers/admin')(passport, models, sequelize));
    app.use('/product', require('../routers/product')(passport, ormModels, models, sequelize));
    app.use('/order', require('../routers/order')(passport, models, sequelize));
    app.use('/tag', require('../routers/tag')(passport, models));
    app.use('/roles', require('../routers/roles')(passport, ormModels, models));
    app.use('/permissions', require('../routers/permissions')(passport, models));
    app.use('/enquery', require('../routers/enquery')(passport, ormModels, sequelize));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, ormModels));
}