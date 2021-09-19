const router = require('express').Router();

router.get('/home', (req, res) => {
  return res.send('home page');
});

router.use('/', require('./auth'));
router.use('/users', require('./user'));

module.exports = router;
