module.exports = (ormModels)=>{
    const User = require('./user')(ormModels);
    const Admin = require ('./admin')(ormModels);
    return {
        User,
        Admin
    }
}