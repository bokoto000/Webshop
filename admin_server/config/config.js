
const sequelize = require('./dbConfig');
const passport = require('passport')
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')

module.exports = async (app) => {
    app.use(cors());
    app.use(session({
        secret: 'webshopadmin',
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
        email text NOT NULL UNIQUE,
        username text NOT NULL UNIQUE,
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

    await sequelize.query(`CREATE TABLE IF NOT EXISTS products
    (
        id serial NOT NULL,
        description text,
        image text,
        name text UNIQUE NOT NULL, 
        price numeric(15,2) NOT NULL,
        stock int NOT NULL,
        CONSTRAINT products_pkey PRIMARY KEY (id)
    )`);


    await sequelize.query(`CREATE TABLE IF NOT EXISTS tags
    (
        tag_id serial NOT NULL,
        name text UNIQUE NOT NULL, 
        CONSTRAINT tags_pkey PRIMARY KEY (tag_id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS producttags
    (
        id serial NOT NULL,
        product_id int NOT NULL,
        tag_id int NOT NULL,
        CONSTRAINT producttags_pkey PRIMARY KEY (id)
    )`);

    const ormModels = require('../orm_models/index')(sequelize);
    const models = require ('../models/index')(ormModels);
    require ('./passportConfig')(passport,ormModels, models);
    require('./routersConfig')(app, ormModels, passport, sequelize);

}