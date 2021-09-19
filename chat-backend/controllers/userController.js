const User = require('../models').User;
const sequelize = require('sequelize');

exports.update = async (req, res) => {
  if (req.file) {
    // req.file.avatart come from multer
    req.body.avatar = req.file.filename;
  }

  try {
    const [rows, result] = await User.update(req.body, {
      where: { id: req.user.id },
      // to return values below
      // 1. update count
      // 2. updated users in array
      returning: true,
      // to execute hash hooks
      individualHooks: true,
    });

    const user = result[0].get({ row: true });
    // to use sequelize instance method when getiing avatar
    user.avatar = result[0].avatar;
    delete user.password;

    return res.send(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
