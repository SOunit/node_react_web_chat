import { FETCH_CHATS, SET_CURRENT_CHAT } from '../actions/chat';

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

    default:
      return state;
  }
};

export default chatReducer;
