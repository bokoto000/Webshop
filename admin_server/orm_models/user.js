const Sequelize = require("sequelize");
module.exports = sequelize => {
  const User = sequelize.define(
    "users",
    {
      id: {
        field: "id",
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        field: "username",
        type: Sequelize.STRING
      },
      firstName: {
        field: "first_name",
        type: Sequelize.STRING
      },
      lastName: {
        field: "last_name",
        type: Sequelize.STRING
      },
      email: {
        field: "email",
        type: Sequelize.STRING
      },
      password: {
        field: "password",
        type: Sequelize.STRING
      }
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  return User;
};
