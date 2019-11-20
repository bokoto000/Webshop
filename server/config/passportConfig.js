const LocalStrategy = require("passport-local");

module.exports = (passport,models) => {
  const User = models.User;
  const ResetPasswordToken = models.ResetPasswordToken;

  passport.serializeUser((user, done) => {
    const userData = {
      id: user.id,
      role: user.role
    };
    if (!user) done(null, false);
    else done(null, userData);
  });

  passport.deserializeUser(async (userData, done) => {
    const id = userData.id;
    const userFromDb = await User.findOne(id);
    const user = {
      id: userFromDb.id,
      firstName: userFromDb.firstName,
      lastName: userFromDb.lastName,
      email: userFromDb.email,
      username: userFromDb.username,
      role: userFromDb.role
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
        const user = await User.findOneByUsername( username );
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
        const role = "Guest";
        const user = await User.findOneByEmail(email);
        const usernameUser = await User.findOneByUsername(username);
        if (user) {
          return done(null, false, "Email is already taken");
        } else if (usernameUser) {
          return done(null, false, "Username is already taken");
        } else {
          await User.createUser(
            firstName,
            lastName,
            email,
            username,
            password,
            role
          );
          const user =  await User.findOneByUsername(username);
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
        const resToken = await ResetPasswordToken.findOne({
          where: { expirePasswordToken: token }
        });
        const userId = resToken.dataValues.id;
        const user = await User.findOne( userId );
        if (!user) {
          return done(null, false, "User doesnt exist");
        } else {
          const user = await User.changePassword(userId, password);
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
