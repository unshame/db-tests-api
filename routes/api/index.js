const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/test', require('./test'));

module.exports = router;
