const LocalStrategy = require("passport-local");

module.exports = (passport, ormModels, models) => {
  const ormUser = ormModels.User;
  const User = models.User;
  const ormAdmin = ormModels.Admin;
  const Admin = models.Admin;
  const ResetPasswordToken = ormModels.ResetPasswordToken;

  passport.serializeUser((user, done) => {
    const userData = {
      id: user.id,
    };
    if (!user) done(null, false);
    else done(null, userData);
  });

  passport.deserializeUser(async (userData, done) => {
    const id = userData.id;
    const userFromDb = await ormUser.findByPk(id);
    const user = {
      id: userFromDb.dataValues.id,
      firstName: userFromDb.dataValues.firstName,
      lastName: userFromDb.dataValues.lastName,
      email: userFromDb.dataValues.email,
      username: userFromDb.dataValues.username,
    };
    if (user) done(null, user);
    else {
      console.error("deserialization error");
    }
  });

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, username, password, done) {
        const user = await ormUser.findOne({ where: { username: username } });
        console.log(user);
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
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, username, password, done) {
        const email = req.body.email;
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
            username,
            password,
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
    "local-changepassword",
    new LocalStrategy(
      {
        passReqToCallback: true
      },
      async function(req, password, done) {
        const token = req.body.token;
        const resToken = await ResetPasswordToken.findOne({where:{expirePasswordToken:token}});
        const userId = resToken.dataValues.id;
        const user = await ormUser.findOne({ where: { id:userId } });
        console.log(user)
        if (!user) {
          return done(null, false, "User doesnt exist");
        } else {
          const user = await User.changePassword(
            userId,
            password,
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
