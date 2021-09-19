const router = require('express').Router();
const { update } = require('../controllers/userController');
const { rules: updateRules } = require('../validators/user');
const { validate } = require('../validators');
const { auth } = require('../middleware/auth');

router.post('/update', [auth, updateRules, validate], update);

module.exports = router;
