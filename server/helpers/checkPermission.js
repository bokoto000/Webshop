const roles = require("./roles");

module.exports = function() {
  return function(req, res, next) {
    return next();
    if (req.user) {
      const role = req.user.role;
      console.log(req.originalUrl);
      const permissions = roles[role].permissions;
      console.log(permissions);
      if (permissions.includes(req.originalUrl)) {
        console.log("true");
        next();
      } else {
        console.log("false");
        return res.status(401).send("You do not have permission");
      }
    } else {
      return res.sendStatus(403);
    }
  };
};
