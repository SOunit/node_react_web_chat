const { Op } = require('sequelize');
const models = require('../models');
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;

exports.index = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: Chat,
        include: [
          { model: User, where: { [Op.not]: { id: req.user.id } } },
          { model: Message, limit: 20, order: [['id', 'DESC']] },
        ],
      },
    ],
  });

  return res.send(user.Chats);
};
