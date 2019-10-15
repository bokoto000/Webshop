const sequelize = require("./dbConfig");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

module.exports = async app => {
  app.use(cors());
  app.use(
    session({
      secret: "webshop",
      resave: true,
      saveUninitialized: true
    })
  );
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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
        role text NOT NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id)
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

  await sequelize.query(`CREATE TABLE IF NOT EXISTS items
    (
        id serial NOT NULL,
        cart_id int NOT NULL,
        product_id int NOT NULL,
        stock int,
        CONSTRAINT items_pkey PRIMARY KEY (id)
    )`);

  await sequelize.query(`CREATE TABLE IF NOT EXISTS carts
    (
        id serial NOT NULL,
        user_id int NOT NULL UNIQUE,
        CONSTRAINT cart_pkey PRIMARY KEY (id)
    )`);

  await sequelize.query(`CREATE TABLE IF NOT EXISTS resetpasswordtokens
    (
        id int UNIQUE NOT NULL,
        token text UNIQUE NOT NULL,
        expire text NOT NULL, 
        CONSTRAINT resetpasswordtokens_pkey PRIMARY KEY (id)
    )`);

  await sequelize.query(`CREATE TABLE IF NOT EXISTS orders
    (
        id serial NOT NULL,
        user_id int NOT NULL,
        status text NOT NULL,
        date text NOT NULL, 
        CONSTRAINT orders_pkey PRIMARY KEY (id)
    )`);

  await sequelize.query(`CREATE TABLE IF NOT EXISTS ordereditems
    (
      id serial NOT NULL,
      order_id int NOT NULL,
      product_id int NOT NULL,
      ordered_price numeric(15,2) NOT NULL,
      stock int,
      CONSTRAINT ordereditems_pkey PRIMARY KEY (id)
    )`);

  await sequelize.query(`CREATE TABLE IF NOT EXISTS pendingpayments
    (
      id serial NOT NULL,
      order_id int NOT NULL,
      payment_id text NOT NULL UNIQUE,
      total text NOT NULL,
      CONSTRAINT pendingpayments_pkey PRIMARY KEY (id)
    )`);

  const ormModels = require("../orm_models/index")(sequelize);
  const models = require("../models/index")(ormModels);
  require("./passportConfig")(passport, ormModels, models);
  require("./routersConfig")(app, ormModels, passport, sequelize, models);
  //require("./paypalConfig")();
};
