module.exports = sequelize => {
  async function findOne(productId) {
    const results = (
      await sequelize.query(
        `SELECT * FROM productimages WHERE "product_id"=$productId LIMIT 1`,
        {
          bind: {productId}
        }
      )
    )[0][0];
    return results;
  }

  return { findOne };
};
