import {
  FETCH_CHATS,
  SET_CURRENT_CHAT,
  FRIENDS_ONLINE,
  FRIEND_ONLINE,
  FRIEND_OFFLINE,
} from '../actions/chat';

const initialState = {
  chats: [],
  currentChat: {},
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_CHATS:
      return {
        ...state,
        chats: payload,
      };

    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: payload,
      };

    case FRIENDS_ONLINE:
      const chatsCopy = state.chats.map((chat) => {
        return {
          ...chat,
          Users: chat.Users.map((user) => {
            if (payload.includes(user.id)) {
              return { ...user, status: 'online' };
            }
            return user;
          }),
        };
      });

      return {
        ...state,
        chats: chatsCopy,
      };

    default:
      return state;
  }
};

export default chatReducer;
