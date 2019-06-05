const passport = require('passport');
const LocalStrategy = require('passport-local');
const models = require('../models');


for (const [userType, userModel] of Object.entries({
    Student: models.Student,
    Teacher: models.Teacher
})) {
    passport.use(userType, new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
    }, (login, password, done) => {
        userModel.findOne({ where: { login } })
            .then((user) => {
                if (!user || !user.validatePassword(password)) {
                    return done(null, false, { errors: { 'login or password': 'is invalid' } });
                }

                return done(null, user);
            }).catch(done);
    }));
}
