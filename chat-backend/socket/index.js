const socketIo = require('socket.io');
const { sequelize } = require('../models');
const Message = require('../models').Message;

// user anyone who login to chat
// key = user id, value = sockets?
// users Map(1) { 1 => { id: 1, sockets: [ 'xGlQAao8aAumlJd_AAAH' ] } }
const users = new Map();
// userSockets Map(1) { 'xGlQAao8aAumlJd_AAAH' => 1 }
const userSockets = new Map();

const socketServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    // save login users, user's sockets
    socket.on('join', async (user) => {
      console.log('socket.on join');
      let sockets = [];

      // if user exists
      if (users.has(user.id)) {
        console.log('socket.on join update');
        // update = add new socket to exsiting user sockets
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

      // ids
      // to emit friends = ONLINE_FRIENDS
      const onlineFriends = [];

      // fetch all users related to login user, this here is on join
      const chatters = await getChatters(user.id);

      // notify his friends, online users
      for (let i = 0; i < chatters.length; i++) {
        // if chatter is online user
        if (users.has(chatters[i])) {
          // chatter is
          // {id: 1, sockets: [aaa, bbb]}
          const chatter = users.get(chatters[i]);

          // emit online to notify existing users that new login user is online
          chatter.sockets.forEach((socket) => {
            try {
              io.to(socket).emit('online', user);
            } catch (err) {}
          });
          onlineFriends.push(chatter.id);
        }
      }

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

    // when front create new message
    // get sockets from message-to users, message-from user to emit received
    // received update user chat screen by adding new message
    socket.on('message', async (message) => {
      let sockets = [];

      // get sockets to emit received to message-from-user
      if (users.has(message.fromUser.id)) {
        sockets = users.get(message.fromUser.id).sockets;
      }

      // get sockets to emit received to message-to-user
      message.toUserId.forEach((id) => {
        // if user login(users data is added when user login)
        if (users.has(id)) {
          sockets = [...sockets, ...users.get(id).sockets];
        }
      });

      try {
        const msg = {
          type: message.type,
          fromUserId: message.fromUser.id,
          chatId: message.chatId,
          message: message.message,
        };

        // create db data
        const savedMessage = await Message.create(msg);

        // change data as frontend expect
        message.User = message.fromUser;
        message.fromUserId = message.fromUser.id;
        message.id = savedMessage.id;
        // to use sequelize custom get
        // message could be message or image
        message.message = savedMessage.message;
        delete message.fromUser;

        // send message to all sockets
        sockets.forEach((socket) => {
          io.to(socket).emit('received', message);
        });
      } catch (err) {}
    });

    socket.on('typing', async (message) => {
      // target here is [chat related users && login users]!!!
      // message -> related users (chat users) -> login users -> emit 'typing'

      // toUserId = user ids = chat.Users = users in chat except yourself
      message.toUserId.forEach((id) => {
        // if to-user is loggedin
        if (users.has(id)) {
          // user can have multiple socket in multiple devices
          users.get(id).sockets.forEach((socket) => {
            io.to(socket).emit('typing', message);
          });
        }
      });
    });

    // when add friend in client
    // send notification to creator(user) and partner(user)
    socket.on('add-friend', (chats) => {
      try {
        let online = 'offline';
        // chats[0] = forCreator = {id, type, Users: [partner], Messages: []}
        // chats[1] = forPartner = {id, type, Users: [partner], Messages: []}
        if (users.has(chats[1].Users[0].id)) {
          // set partner online
          online = 'online';
          // set creator online
          chats[0].Users[0].status = 'online';

          // get partner user and emit to partner user sockets
          users.get(chats[1].Users[0].id).sockets.forEach((socket) => {
            // send other users info, creator info here
            io.to(socket).emit('new-chat', chats[0]);
          });
        }

        if (users.has(chats[0].Users[0].id)) {
          chats[1].Users[0].status = online;
          users.get(chats[0].Users[0].id).sockets.forEach((socket) => {
            // send other users info, partner info here
            io.to(socket).emit('new-chat', chats[1]);
          });
        }
      } catch {}
    });

    socket.on('add-user-to-group', async ({ chat, newChatter }) => {
      if (users.has(newChatter.id)) {
        newChatter.status = 'online';
      }

      // old users
      chat.Users.forEach((user, index) => {
        if (users.has(user.id)) {
          chat.Users[user.id].status = 'online';
          users.get(user.id).sockets.forEach((socket) => {
            try {
              io.to(socket).emit('added-user-to-group', {
                chat,
                chatters: [newChatter],
              });
            } catch (err) {}
          });
        }
      });

      // send to new chatter
      if (users.has(newChatter.id)) {
        users.get(newChatter.id).sockets.forEach((socket) => {
          try {
            io.to(socket).emit('added-user-to-group', {
              chat,
              chatters: chat.Users,
            });
          } catch (err) {}
        });
      }
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
