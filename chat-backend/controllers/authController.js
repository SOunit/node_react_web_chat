const User = require('../models').User;
const bcrypt = require('bcrypt');

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

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ message: `Incorrect password` });
    }
    // check if password matches
    // generate auth token
    return res.send(user);
  } catch (e) {
    console.log(e);
  }

  return res.send([email, password]);
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
};
