const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Product = sequelize.define("products", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      field: "name",
      type: Sequelize.STRING
    },
    description: {
      field: "description",
      type: Sequelize.STRING
    },
    image: {
      field: "image",
      type: Sequelize.STRING
    },
    price: {
      field: "price",
      type: Sequelize.DECIMAL
    },
    stock: {
      field: "stock",
      type: Sequelize.INTEGER
    }
  });
  return Product;
};
