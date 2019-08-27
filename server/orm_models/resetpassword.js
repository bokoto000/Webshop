const Sequelize = require("sequelize");
module.exports = sequelize => {
  const ResetPasswordToken = sequelize.define("resetpasswordtoken", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    resetPasswordToken: {
      field: "token",
      type: Sequelize.STRING
    },
    expirePasswordToken: {
      field: "expire",
      type: Sequelize.STRING
    }
  });
  return ResetPasswordToken;
};
