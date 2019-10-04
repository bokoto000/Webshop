const Sequelize = require("sequelize");
module.exports = sequelize => {
    const PermissionRoles = sequelize.define(
        "permissionsroles",
        {
            id: {
                field: "id",
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            permissionId: {
                field: "permission_id",
                type: Sequelize.INTEGER
            },
            roleId: {
                field: "role_id",
                type: Sequelize.INTEGER
            }
        }
    );
    return PermissionRoles;
};
