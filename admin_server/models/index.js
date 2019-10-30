module.exports = (sequelize)=>{
    const User = require('./user')(sequelize);
    return {
        User
    }
}