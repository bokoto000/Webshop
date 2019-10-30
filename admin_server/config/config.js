
const sequelize = require('./dbConfig');
const passport = require('passport')
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')

module.exports = async (app) => {
    app.use(cors());
    app.use(session({
        name: 'webshopadmin',
        secret: 'webshopadmin',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
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
        email text NOT NULL UNIQUE,
        CONSTRAINT users_pkey PRIMARY KEY (id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS admins
    (
        id serial NOT NULL,
        first_name text ,
        last_name text ,
        email text NOT NULL UNIQUE,
        username text NOT NULL,
        password text  NOT NULL,
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

    await sequelize.query(`CREATE TABLE IF NOT EXISTS roles
    (
        id serial NOT NULL,
        role text NOT NULL UNIQUE,
        CONSTRAINT roles_pkey PRIMARY KEY (id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS userroles
    (
        id serial NOT NULL,
        user_id int NOT NULL,
        role_id int NOT NULL,
        CONSTRAINT userroles_pkey PRIMARY KEY (id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS permissionroles
    (
        id serial NOT NULL,
        permission_id int NOT NULL,
        role_id int NOT NULL,
        CONSTRAINT permissionroles_pkey PRIMARY KEY (id)
    )`);


    await sequelize.query(`CREATE TABLE IF NOT EXISTS tags
    (
        tag_id serial NOT NULL,
        name text UNIQUE NOT NULL, 
        CONSTRAINT tags_pkey PRIMARY KEY (tag_id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS permissions
    (
        id serial NOT NULL,
        name text UNIQUE NOT NULL,
        permission text UNIQUE NOT NULL, 
        CONSTRAINT permissons_pkey PRIMARY KEY (id)
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS producttags
    (
        id serial NOT NULL,
        product_id int NOT NULL,
        tag_id int NOT NULL,
        CONSTRAINT producttags_pkey PRIMARY KEY (id)
    )`);

    const ormModels = require('../orm_models/index')(sequelize);
    const models = require ('../models/index')(sequelize);
    require ('./passportConfig')(passport,ormModels, models);
    require('./routersConfig')(app, ormModels, passport, sequelize, models);

}