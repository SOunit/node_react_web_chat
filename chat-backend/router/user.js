const router = require('express').Router();
const { update, search } = require('../controllers/userController');
const { rules: updateRules } = require('../validators/user/update');
const { validate } = require('../validators');
const { auth } = require('../middleware/auth');
const { useFile } = require('../middleware/fileUpload');

router.post('/update', [auth, useFile, updateRules, validate], update);
router.get('/search', auth, search);

module.exports = router;
