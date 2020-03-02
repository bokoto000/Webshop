module.exports = (sequelize) => {

    async function deleteAllById(id) {
        const roles = (await sequelize.query(`DELETE FROM userroles WHERE id=$id`,{
            bind:{
                id
            }
        }))[0];
        return roles;
    }

    async function findOne(userId, roleId){
        const roles = (await sequelize.query(`SELECT * FROM userroles WHERE user_id=$userId
         AND role_id=$roleId`,{
             bind:{
                 userId,
                 roleId
             }
         }))[0][0];
        return roles;
    }

    async function deleteOne(userId,roleId){
        const role = (await sequelize.query(`DELETE FROM userroles 
        WHERE user_id=$userId AND role_id=$roleId`,{
            bind:{
                userId,
                roleId
            }
        }));
        return role;
    }

    async function create(userId, roleId){
        const role = (await sequelize.query(`INSERT INTO userroles (user_Id,role_id) 
        VALUES($userId,$roleId)`,{
            bind:{
                userId,
                roleId
            }
        }))[0];
        return role;
    }

    return { deleteAllById, findOne, deleteOne, create };
}