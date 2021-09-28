import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import {
  fetchChats,
  onlineFriends,
  onlineFriend,
  offlineFriend,
  setSocket,
  receivedMessage,
  senderTyping,
  createChat,
  addUserToGroup,
  leaveCurrentChat,
  deleteCurrentChat,
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
        // set socket object in redux
        // one socket only
        dispatch(setSocket(socket));

        // save login-user sockets
        // emit online
        socket.emit('join', user);

        // show typing popup by updating typing state
        socket.on('typing', (sender) => {
          console.log('Event', sender);
          dispatch(senderTyping(sender));
        });

        // what is the difference of online / offline emit?
        // online / offline update open-chat(=current chat)
        // friends does not update open-chat(=current chat)
        // friends = user id list
        socket.on('friends', (friends) => {
          console.log('Friends', friends);
          dispatch(onlineFriends(friends));
        });

        // update user status to online in chats, open-chats
        socket.on('online', (user) => {
          console.log('Online', user);
          dispatch(onlineFriend(user));
        });

        // update user status to online in chats, open-chats
        socket.on('offline', (user) => {
          console.log('Offline', user);
          dispatch(offlineFriend(user));
        });

        // to update messages in chat
        // to add new message in chat, open chat
        socket.on('received', (message) => {
          dispatch(receivedMessage(message, user.id));
        });

        socket.on('new-chat', (chat) => {
          dispatch(createChat(chat));
        });

        socket.on('added-user-to-group', (group) => {
          dispatch(addUserToGroup(group));
        });

        socket.on('remove-user-from-chat', (data) => {
          data.currentUserId = user.id;
          dispatch(leaveCurrentChat(data));
        });

        socket.on('delete-chat', (chatId) => {
          dispatch(deleteCurrentChat(chatId));
        });
      })
      .catch((err) => console.log(err));
  }, [dispatch]);
}

export default useSocket;
