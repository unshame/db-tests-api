const passport = require('passport');
const LocalStrategy = require('passport-local');

const userModels = {
    Student: require('../models/Student'),
    Teacher: require('../models/Teacher')
};

for (const [userType, userModel] of Object.entries(userModels)) {

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
