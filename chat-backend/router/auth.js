const router = require('express').Router();

router.get('/login', (req, res) => {
  return res.send('login page');
});

router.get('/register', (req, res) => {
  return res.send('register page');
});

module.exports = router;
