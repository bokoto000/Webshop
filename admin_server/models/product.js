module.exports = sequelize => {
  async function findOne() {
    const product = (await sequelize.query(``))[0][0];
    return product;
  }

  async function findByPk(id) {
    const product = (await sequelize.query(
      `SELECT * FROM products WHERE id='${id}'`
    ))[0][0];
    return product;
  }

  async function updateStock(stock, id) {
    const update = await sequelize.query(
      `UPDATE products SET stock='${stock}' WHERE id='${id}'`
    );
  }

  async function create(image, name, description, price, stock) {
      const result = await sequelize.query(`INSERT INTO products (image,name,description,price,stock) VALUES ('${image}','${name}','${description}','${price}','${stock}')`)
  }

  async function findAll() {
    const product = (await sequelize.query(``))[0][0];
    return product;
  }
  return { findOne, findByPk, findAll, create, updateStock};
};
