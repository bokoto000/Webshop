const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Permission = sequelize.define("permissions", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      field: "name",
      type: Sequelize.STRING
    },
    permission:{
        field:"permission",
        type:Sequelize.STRING
    }
  });
  return Permission;
};
