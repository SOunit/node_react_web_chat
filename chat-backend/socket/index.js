const socketIo = require('socket.io');

const socketServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    socket.on('join', async (user) => {
      console.log(`New user joined: ${user.firstName}`);

      // return response back to front
      io.to(socket.id).emit('typing', 'User typing...');
    });
  });
};

module.exports = socketServer;
