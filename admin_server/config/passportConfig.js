const LocalStrategy = require("passport-local");

module.exports = (passport, ormModels, models) => {
  const ormUser = ormModels.User;
  const User = models.User;
  const ormAdmin = ormModels.Admin;
  const Admin = models.Admin;

  passport.serializeUser((user, done) => {
    const userData = {
      id: user.id,
      role:user.role
    };
    if (!user) done(null, false);
    else done(null, userData);
  });

  passport.deserializeUser(async (userData, done) => {
    console.log(done);
    const id = userData.id;
    let userFromDb;
    userFromDb = await ormAdmin.findByPk(id);
    console.log(id);
    console.log(userFromDb);
    const user = {
      id: userFromDb.dataValues.id,
      firstName: userFromDb.dataValues.firstName,
      lastName: userFromDb.dataValues.lastName,
      email: userFromDb.dataValues.email,
      username: userFromDb.dataValues.username,
      role: userFromDb.dataValues.role
    };
    if (user) done(null, user);
    else {
      console.error("deserialization error");
    }
  });

  passport.use(
    "local-login-admin",
    new LocalStrategy(async function(username, password, done) {
      try {
        const user = await ormAdmin.findOne({ where: { username: username } });
        console.log(user);
        if (user) {
          const comp = await Admin.validPassword(password, user.password);
          if (!comp) return done(null, false, "Incorrect password");
          return done(null, user);
        } else {
          return done(null, false, "No such user found");
        }
      } catch (e) {
        console.log("passport");
      }
    })
  );

  passport.use(
    "local-signup-admin",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, username, password, done) {
        const user = await ormAdmin.findOne({ where: { username: username } });
        if (user) {
          return done(null, false, "User already exists");
        } else {
          const user = await Admin.createUser(
            username,
            password
          );
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      }
    )
  );

};
