module.exports = (app, ormModels, passport) => {
    app.use('/product',require('../routers/product') (passport, ormModels))
    app.use('/user',require('../routers/user') (passport, ormModels));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, ormModels));
}