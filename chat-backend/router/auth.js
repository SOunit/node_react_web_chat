const router = require('express').Router();
const { login, register } = require('../controllers/authController');
const { body } = require('express-validator');

router.post(
  '/register',
  [
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('gender').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
  ],
  register
);

router.post('/login', login);

module.exports = router;
