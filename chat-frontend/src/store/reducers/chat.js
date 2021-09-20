import { FETCH_CHATS } from '../actions/chat';

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
    default:
      return state;
  }
};

export default chatReducer;
