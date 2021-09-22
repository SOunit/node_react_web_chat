const socketIo = require('socket.io');
const { sequelize } = require('../models');

// user anyone who login to chat
const users = new Map();
const userSockets = new Map();

const socketServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    socket.on('join', async (user) => {
      console.log('socket.on join');
      let sockets = [];

      if (users.has(user.id)) {
        console.log('socket.on join update');
        // update
        const existingUser = users.get(user.id);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(user.id, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
        userSockets.set(socket.id, user.id);
      } else {
        console.log('socket.on join create');
        // create
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
        userSockets.set(socket.id, user.id);
      }

      console.log('socket.on join users', users);
      console.log('socket.on join userSockets', userSockets);

      // ids
      const onlineFriends = [];

      // query
      const chatters = await getChatters(user.id);
      console.log(chatters);

      // notify his friends that user is now online
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = users.get(chatters[i]);
          chatter.sockets.forEach((socket) => {
            try {
              io.to(socket).emit('online', user);
            } catch (err) {}
          });
          onlineFriends.push(chatter.id);
        }
      }

      console.log('sockets for emit friends', sockets);
      // send to user sockets which of his friends are online
      sockets.forEach((socket) => {
        try {
          io.to(socket).emit('friends', onlineFriends);
        } catch (err) {}
      });

      // console.log(`New user joined: ${user.firstName}`);
      // return response back to front
      // io.to(socket.id).emit('typing', 'User typing...');
    });

    socket.on('disconnect', async () => {
      console.log('socket.on disconnect');

      if (userSockets.has(socket.id)) {
        const user = users.get(userSockets.get(socket.id));
        if (user.sockets.length > 1) {
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) {
              return true;
            }
            userSockets.delete(sock);
            return false;
          });

          users.set(user.id, user);
        } else {
          const chatters = await getChatters(user.id);

          // notify his friends that user is now offline
          for (let i = 0; i < chatters.length; i++) {
            if (users.has(chatters[i])) {
              users.get(chatters[i]).sockets.forEach((socket) => {
                try {
                  io.to(socket).emit('offline', user);
                } catch (err) {}
              });
            }
          }
          userSockets.delete(socket.id);
          users.delete(user.id);
        }
      }
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
