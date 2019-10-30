const LocalStrategy = require("passport-local");

module.exports = (passport, ormModels, models) => {
  const ormAdmin = ormModels.Admin;
  const Admin = models.User;

  passport.serializeUser((user, done) => {
    const userData = {
      id: user.id,
      role:user.role
    };
    if (!user) done(null, false);
    else done(null, userData);
  });

  passport.deserializeUser(async (userData, done) => {
    const id = userData.id;
    let userFromDb;
    userFromDb = await Admin.findByPk(id);
    console.log(userData);
    const user = {
      id: userFromDb.id,
      firstName: userFromDb.first_name,
      lastName: userFromDb.last_name,
      email: userFromDb.email,
      username: userFromDb.username
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
        const user = await Admin.findOne(username);
        if (user) {
          const comp = await Admin.validPassword(username, password, user.password);
          if (!comp) return done(null, false, "Incorrect password");
          return done(null, user);
        } else {
          return done(null, false, "No such user found");
        }
      } catch (e) {
        console.log("passport");
        console.error(e);
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
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const user = await Admin.findOne(username);
        if (user) {
          return done(null, false, "User already exists");
        } else {
          console.log(email);
          const user = await Admin.createUser(
            username,
            password,
            email,
            firstName,
            lastName
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
