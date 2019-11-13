module.exports = (sequelize) => {

    async function create(name){
        const results = (await sequelize.query(`INSERT INTO roles (role) VALUES ('${name}')`));
        return results;
    }

    async function findOne(id) {
        const role = (await sequelize.query(`SELECT * FROM roles WHERE id='${id}' LIMIT 1`))[0][0];
        return role;
    }

    async function findByPk(id) {
        const role = (await sequelize.query(``))[0][0];
        return role;
    }

    async function findAll() {
        const role = (await sequelize.query(`SELECT * FROM roles`))[0];
        return role;
    }
    return { findOne, findByPk, findAll,create };
}