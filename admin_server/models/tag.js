module.exports = (sequelize) => {

    async function findOne() {
        const tag = (await sequelize.query(``))[0][0];
        return tag;
    }

    async function findByPk(id) {
        const tag = (await sequelize.query(``))[0][0];
        return tag;
    }

    async function create(name){
        const results = (await sequelize.query(`INSERT INTO tags (name) VALUES ('${name}')`));
        return results;
    }

    async function findAll() {
        const tag = (await sequelize.query(`SELECT * FROM tags`))[0][0];
        return tag;
    }
    return { findOne, findByPk, findAll };
}