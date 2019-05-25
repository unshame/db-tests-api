const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');

const userModels = {
  Student: require('../../models/Student'),
  Teacher: require('../../models/Teacher')
};

router.post('/login', (req, res, next) => {
  const { body: { login, password, isTeacher } } = req;

  if (!login || !password) {
    return res.status(422).json({
      errors: {
        login: !login ? 'is required' : undefined,
        password: !password ? 'is required' : undefined
      }
    });
  }

  return passport.authenticate(isTeacher ? 'Teacher' : 'Student', { session: false }, (err, user, info) => {
    if(err) {
      return next(err);
    }

    if(user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).json(info);
  })(req, res, next);
});

router.get('/', auth.required, (req, res, next) => {
  const { payload: { id, isTeacher } } = req;

  const model = userModels[isTeacher ? 'Teacher' : 'Student'];

  return model.findOne({ where: { [model.getUserIdKey()]: id }})
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;
