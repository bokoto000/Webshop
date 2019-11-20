module.exports = sequelize => {
    async function create(userId) {
      const cart = (await sequelize.query(`INSERT INTO carts (user_id) VALUES ('${userId}')`));
      return cart;
    }

    async function findOne(userId){
      const cart = (await sequelize.query(`SELECT * carts WHERE user_id ='${userId}'`))[0][0];
      return cart;
    }

    async function destroy(userId){
      const cart = (await sequelize.query(`DELETE FROM carts WHERE id='${userId}'`))
    }

    return { create, findOne };
  };
  
