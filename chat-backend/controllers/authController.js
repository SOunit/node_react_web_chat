const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/app');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the user
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // check if user found
    if (!user) {
      return res.status(404).send({ message: `User not found!` });
    }

    // check if password matches
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ message: `Incorrect password` });
    }

    // generate auth token
    const userWithToken = generateToken(user.get({ row: true }));
    userWithToken.avatar = user.avatar;

    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // generate auth token
    const userWithToken = generateToken(user.get({ row: true }));
    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

const generateToken = (user) => {
  console.log('generateToken start');

  delete user.password;
  console.log('generateToken delete', user);

  const token = jwt.sign(user, config.appKey, {
    // 86400 is 1 week
    expiresIn: 86400,
  });

  console.log(token);

  return { ...user, ...{ token } };
};
