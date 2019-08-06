const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

module.exports = (passport, ormModels) => {

    router.post('/register', (req, res, next) => {
        passport.authenticate('local-signup', function(err, user) {
            if(err) {
                console.log(err);
                return res.status(400).send();
            }
            req.logIn(user, (err) => {
                if(err)  {
                    console.log(err);
                    return res.status(400).send();
                }
                req.session.user = req.user;
                return res.json();
            });
          })(req, res, next);
    })

    return router;
}