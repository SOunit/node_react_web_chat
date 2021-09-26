const User = require('../models').User;
const sequelize = require('sequelize');

exports.update = async (req, res) => {
  if (req.file) {
    // req.file.avatart come from multer
    req.body.avatar = req.file.filename;
  }

  if (typeof req.body.avatar !== 'undefined' && req.body.avatar.length === 0) {
    delete req.body.avatar;
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

exports.search = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        [sequelize.Op.or]: {
          namesConcated: sequelize.where(
            sequelize.fn(
              'concat',
              sequelize.col('firstName'),
              ' ',
              sequelize.col('lastName'),
              {
                [sequelize.Op.iLike]: `%${req.query.term}%`,
              }
            )
          ),
          email: {
            [sequelize.Op.iLike]: `%${req.query.term}%`,
          },
        },
        [sequelize.Op.not]: {
          id: req.user.id,
        },
      },
      limit: 10,
    });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
