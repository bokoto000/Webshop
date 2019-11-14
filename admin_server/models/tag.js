module.exports = (sequelize) => {

    async function create(name){
        const results = (await sequelize.query(`INSERT INTO tags (name) VALUES ('${name}')`));
        return results;
    }

    async function findAll() {
        const tag = (await sequelize.query(`SELECT * FROM tags`))[0];
        return tag;
    }
    return { create, findAll };
}