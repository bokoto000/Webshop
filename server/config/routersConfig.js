module.exports = (app, ormModels, passport) => {
    app.use('/admin', require('../routers/admin')(passport, ormModels));
    app.use('/get-sess-info', require('../routers/get-sess-info')(passport, ormModels));
}