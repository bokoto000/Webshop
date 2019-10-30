module.exports = (sequelize) => {

    async function create(name, permission){
        const perm = (await sequelize.query(`INSERT INTO permissions ('name','permission') VALUES ('${name}','${permission}')`))
        return perm[0];
    }

    async function findAll(){
        const results = (await sequelize.query(`SELECT * FROM permissions`))[0];
        return results;
    }

    return {create};
}