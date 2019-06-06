const jwt = require('express-jwt');

const jwtRequiredMiddleware = jwt({
    secret: 'secret',
    userProperty: 'payload',
});

function checkUserTypeMiddleware(requiredType) {
    return (req, res, next) => {
        const { payload: { type } } = req;

        if (type != requiredType) {
            return next(new Error(`user must be ${requiredType}`));
        }

        return next();
    };
}

const auth = {
    required: jwtRequiredMiddleware,
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        credentialsRequired: false,
    }),
    teacher: [jwtRequiredMiddleware, checkUserTypeMiddleware('Teacher')],
    student: [jwtRequiredMiddleware, checkUserTypeMiddleware('Student')]
};

module.exports = auth;
