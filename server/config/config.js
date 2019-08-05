
const sequelize = require('./dbConfig');
const passport = require('passport')
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')

module.exports = async (app) => {
    app.use(cors());
    app.use(session({
        secret: 'webshop',
        resave: true,
        saveUninitialized: true
    }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(passport.initialize());
    app.use(passport.session());

    await sequelize.query(`CREATE TABLE IF NOT EXISTS users
    (
        id serial NOT NULL,
        first_name text ,
        last_name text ,
        email text NOT NULL,
        username text NOT NULL,
        password text  NOT NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS admins
    (
        id serial NOT NULL,
        username text NOT NULL,
        password text  NOT NULL,
        auth BOOLEAN,
        CONSTRAINT admins_pkey PRIMARY KEY (id)
    )`);

    const ormModels = require('../orm_models/index')(sequelize);
    const models = require ('../models/index')(ormModels);
    require ('./passportConfig')(passport,ormModels, models);
    require('./routersConfig')(app, ormModels, passport);

}