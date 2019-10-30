module.exports = (sequelize) => {

    async function create(name){
        const results = (await sequelize.query(`INSERT INTO roles (name) VALUES ('${name}')`));
        return results;
    }

    async function findOne() {
        const role = (await sequelize.query(``))[0][0];
        return role;
    }

    async function findByPk(id) {
        const role = (await sequelize.query(``))[0][0];
        return role;
    }

    async function findAll() {
        const role = (await sequelize.query(``))[0][0];
        return role;
    }
    return { findOne, findByPk, findAll };
}