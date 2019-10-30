const sequelize = require("./dbConfig");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const fs = require("fs");

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

  const sql = fs.readFileSync(__dirname+'/initDb.sql').toString();
  await sequelize.query(sql);

  const ormModels = require("../orm_models/index")(sequelize);
  const models = require("../models/index")(ormModels);
  require("./passportConfig")(passport, ormModels, models);
  require("./routersConfig")(app, ormModels, passport, sequelize, models);
  //require("./paypalConfig")();
};
