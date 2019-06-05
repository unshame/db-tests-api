const jwt = require('express-jwt');

const jwtRequiredMiddleware = jwt({
    secret: 'secret',
    userProperty: 'payload',
});

const auth = {
    required: jwtRequiredMiddleware,
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        credentialsRequired: false,
    }),
    teacher: [jwtRequiredMiddleware, (req, res, next) => {
        const { payload: { type } } = req;

        if (type != 'Teacher') {
            return next(new Error('user must be teacher'));
        }

        return next();
    }]
};

module.exports = auth;
