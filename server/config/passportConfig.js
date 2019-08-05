const LocalStrategy = require("passport-local");

module.exports = (passport, ormModels, models) => {
  const ormUser = ormModels.User;
  const User = models.User;
  const ormAdmin = ormModels.Admin;
  const Admin = models.Admin;

  passport.serializeUser((user, done) => {
      if (!user) done(null, false);
      else done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const userFromDb = await ormAdmin.findByPk(id);
    const user = {
      id: userFromDb.dataValues.id,
      firstName: userFromDb.dataValues.firstName,
      lastName: userFromDb.dataValues.lastName,
      email: userFromDb.dataValues.email
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
        if (user && user.auth) {
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
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, email, password, done) {
        const user = await ormUser.findOne({ where: { email: email } });
        if (user) {
          const comp = await User.validPassword(password, user.password);
          if (!comp) return done(null, false, "Incorrect password");
          return done(null, user);
        } else {
          return done(null, false, "No such email found");
        }
      }
    )
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
            password,
            (auth = "FALSE")
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

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, email, password, done) {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const user = await ormUser.findOne({ where: { email: email } });
        if (user) {
          return done(null, false, "User already exists");
        } else {
          const user = await User.createUser(
            firstName,
            lastName,
            email,
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
