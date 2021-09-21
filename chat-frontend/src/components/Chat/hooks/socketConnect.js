import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

function useSocket(user, dispatch) {
  useEffect(() => {
    // this connection doesn't work...
    // const socket = socketIOClient.connect(`/socket.io`);

    // this connection worked!
    const socket = socketIOClient({ path: '/socket.io' });
    socket.emit('join', user);

    // listen to socket for backend sending socket
    socket.on('typing', (user) => {
      console.log('Event', user);
    });
  }, [dispatch]);
}

export default useSocket;
