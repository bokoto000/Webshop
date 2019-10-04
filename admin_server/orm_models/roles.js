const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Roles = sequelize.define("roles", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      field: "role",
      type: Sequelize.INTEGER,
    }
  });
  return Roles;
};
