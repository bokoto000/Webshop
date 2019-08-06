const Sequelize = require ('sequelize');
module.exports = sequelize => {
  const User = sequelize.define(
    "admins",
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
      password: {
        field: "password",
        type: Sequelize.STRING
      },
      auth:{
        field:"auth",
        type: Sequelize.BOOLEAN
      }
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  return User;
};
