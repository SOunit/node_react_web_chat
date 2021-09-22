const socketIo = require('socket.io');
const { sequelize } = require('../models');

const users = new Map();

const socketServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    socket.on('join', async (user) => {
      let sockets = [];

      if (users.has(user.id)) {
        // update
        const existingUser = users.get(user.id);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(user.id, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
      } else {
        // create
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
      }

      // ids
      const onlineFriends = [];

      // query
      const chatters = await getChatters(user.id);
      console.log(chatters);

      // notify his friends that user is now online
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = users.get(chatter[i]);
          chatters.sockets.forEach((socket) => {
            try {
              io.to(socket).emit('online', user);
            } catch (err) {}
          });
          onlineFriends.push(chatter.id);
        }
      }

      // send to user sockets which of his friends are online
      sockets.forEach(() => {
        try {
          io.to(socket).emit('friends', onlineFriends);
        } catch (err) {}
      });

      // console.log(`New user joined: ${user.firstName}`);
      // return response back to front
      // io.to(socket.id).emit('typing', 'User typing...');
    });
  });
};

const getChatters = async (userId) => {
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT
        "cu"."userId"
      FROM
        "ChatUsers" as cu
      INNER JOIN
        (
          SELECT
            "c"."id"
          FROM
            "Chats" as c
          WHERE
            exists
            (
              SELECT
                "u"."id"
              FROM
                "Users" as u
              INNER JOIN
                "ChatUsers"
              ON
                "u"."id" = "ChatUsers"."userId"
              WHERE
                u.id = ${parseInt(userId)}
              AND
                c.id = "ChatUsers"."chatId"
            )
        ) as cjoin
      ON
        cjoin.id = "cu"."chatId"
      WHERE
        "cu"."userId" != ${parseInt(userId)}
    `);

    return results.length > 0 ? results.map((elm) => elm.userId) : [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = socketServer;
