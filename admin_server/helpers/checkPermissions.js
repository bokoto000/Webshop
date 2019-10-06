
const sequelize = require('../config/dbConfig');
const ormModels = require('../orm_models/index')(sequelize);

const User = ormModels.Admin;
const Role = ormModels.Role;
const UserRole = ormModels.UserRole;


module.exports = function () {
    return async (req, res, next) => {

        if (req.user) {
            const id = req.user.id;
            let permissions = await sequelize.query(`SELECT "userroles".*,"roles".*, "permissions".*,"permissionroles".*,"admins".*
            FROM (SELECT "admins"."id",
            "admins"."first_name" as "firstName",
            "admins"."last_name" as "lastName",
            "admins"."email" as "email",
            "admins"."username" as "username"
                  FROM "admins"
                  WHERE "admins"."id" = ${id} LIMIT 1) AS "admins"
                   LEFT OUTER JOIN "userroles" AS "userroles" ON "admins"."id" = "userroles"."user_id" 
                   LEFT OUTER JOIN "roles" AS "roles" ON "userroles"."role_id" = "roles"."id"
                   LEFT OUTER JOIN "permissionroles" AS "permissionroles" ON "roles"."id" = "permissionroles"."role_id"
                   LEFT OUTER JOIN "permissions" AS "permissions" ON "permissionroles"."permission_id" = "permissions"."id"
                   ;`);

            console.log(req.originalUrl);
            let permLength = permissions[0].length;
            for(let i=0;i<permLength;i++){
                const perm = permissions[0][i].permission;
                const regex = new RegExp(`^${perm}.*$`);
                if(regex.test(perm)){
                    return next();
                }
            }
            if (permissions.includes(req.originalUrl)) {
                next();
            } else {
                return res.status(401).send("You do not have permission");
            }
        } else {
            return res.sendStatus(403);
        }
    };
};
