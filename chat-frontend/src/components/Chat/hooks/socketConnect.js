import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import {
  fetchChats,
  onlineFriends,
  onlineFriend,
  offlineFriend,
  setSocket,
  receivedMessage,
} from '../../../store/actions/chat';

function useSocket(user, dispatch) {
  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => {
        console.log(res);

        // this connection doesn't work...
        // const socket = socketIOClient.connect(`/socket.io`);

        // this connection worked!
        const socket = socketIOClient({ path: '/socket.io' });
        dispatch(setSocket(socket));

        socket.emit('join', user);

        // listen to socket for backend sending socket
        socket.on('typing', (user) => {
          console.log('Event', user);
        });

        socket.on('friends', (friends) => {
          console.log('Friends', friends);
          dispatch(onlineFriends(friends));
        });

        socket.on('online', (user) => {
          console.log('Online', user);
          dispatch(onlineFriend(user));
        });

        socket.on('offline', (user) => {
          console.log('Offline', user);
          dispatch(offlineFriend(user));
        });

        socket.on('received', (message) => {
          dispatch(receivedMessage(message, user.id));
        });
      })
      .catch((err) => console.log(err));
  }, [dispatch]);
}

export default useSocket;
