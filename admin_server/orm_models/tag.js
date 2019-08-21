const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Tag = sequelize.define("tags", {
    id: {
      field: "tag_id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      field: "name",
      type: Sequelize.STRING
    }
  });
  return Tag;
};
