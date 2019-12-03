module.exports = sequelize => {
  async function findOne(productId) {
    const results = (
      await sequelize.query(
        `SELECT * FROM productimages WHERE "product_id"='${productId}' LIMIT 1`
      )
    )[0][0];
    return results;
  }
  
  async function create(productId,imageData) {
    const results = (
      await sequelize.query(
        `INSERT INTO productimages (product_id, image_data) VALUES('${productId}','${imageData}')`
      )
    );
    return results;
  }

  return { findOne,create };
};
