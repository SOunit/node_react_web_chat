import ChatService from '../../services/chatService';

export const FETCH_CHATS = 'FETCH_CHATS';

export const fetchChats = () => (dispatch) => {
  return ChatService.fetchChats()
    .then((data) => {
      data.forEach((chat) => {
        chat.Users.forEach((user) => {
          user.status = 'offline';
        });
        chat.Messages.reverse();
      });

      dispatch({ type: FETCH_CHATS, payload: data });
      return data;
    })
    .catch((err) => {
      throw err;
    });
};
