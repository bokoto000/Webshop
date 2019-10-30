module.exports = (sequelize) => {

    async function findOne() {
        const user = (await sequelize.query(``))[0][0];
        return user;
    }

    async function findByPk(id) {
        const user = (await sequelize.query(``))[0][0];
        return user;
    }

    async function findAll() {
        const user = (await sequelize.query(``))[0][0];
        return user;
    }
    return { findOne, findByPk, findAll };
}