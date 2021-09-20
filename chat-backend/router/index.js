const router = require('express').Router();

router.get('/home', (req, res) => {
  return res.send('home page');
});

router.use('/', require('./auth'));
router.use('/users', require('./user'));
router.use('/chats', require('./chat'));

module.exports = router;
