const Sequelize = require("sequelize");
module.exports = sequelize => {
    const UserRoles = sequelize.define(
        "userroles",
        {
            id: {
                field: "id",
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                field: "user_id",
                type: Sequelize.INTEGER
            },
            roleId: {
                field: "role_id",
                type: Sequelize.INTEGER
            }
        }
    );
    return UserRoles;
};
