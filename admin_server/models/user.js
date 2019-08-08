const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = (ormModels) => {
    const ormUser = ormModels.User;
    async function createUser(firstName, lastName, email, username, password) {
        const hash = await bcrypt.hash(password, saltRounds);
        if (hash) {
            const user = await ormUser.create({ firstName, lastName, email, username, password: hash});
            return user;
        }
    }
    async function validPassword(password, hash) {
        const comp = await bcrypt.compare(password, hash);
        return comp;
    }
    return { createUser, validPassword };
}