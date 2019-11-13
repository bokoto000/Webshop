module.exports = sequelize => {

    async function findOne(productId, tagId) {
        const results = (await sequelize.query(`SELECT * FROM producttags WHERE "product_id"='${productId}' AND "tag_id"='${tagId}' LIMIT 1`))[0];
        return results;
      }

    async function create(productId, tagId){
        const results = (await sequelize.query(`INSERT INTO producttags (product_id,tag_id) VALUES ('${productId}','${tagId}')`));
        return results;
    }
    
    return { findOne, create};
  };
  