import {
  FETCH_CHATS,
  SET_CURRENT_CHAT,
  FRIENDS_ONLINE,
  FRIEND_ONLINE,
  FRIEND_OFFLINE,
  SET_SOCKET,
  RECEIVED_MESSAGE,
  SENDER_TYPING,
  PAGINATE_MESSAGES,
  INCREMENT_SCROLL,
} from '../actions/chat';

const initialState = {
  chats: [],
  // open chat in message box
  currentChat: {},
  socket: {},
  newMessage: { chatId: null, seen: null },
  scrollBottom: 0,
  senderTyping: { typing: false },
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;
  console.log(type);
  console.log(payload);

  switch (type) {
    case FETCH_CHATS: {
      return {
        ...state,
        chats: payload,
      };
    }

    case SET_CURRENT_CHAT: {
      return {
        ...state,
        currentChat: payload,
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: null },
      };
    }

    case FRIENDS_ONLINE: {
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
    }

    case FRIEND_ONLINE: {
      // current chat = open chat
      // fetch data to update user status
      let currentChatCopy = { ...state.currentChat };

      // update logged-in-user status to online
      // state.chats = chats connected to login user
      const chatsCopy = state.chats.map((chat) => {
        const Users = chat.Users.map((user) => {
          if (user.id === parseInt(payload.id)) {
            return { ...user, status: 'online' };
          }
          return user;
        });

        // update current chat if chat update should be applied too
        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...currentChatCopy,
            Users,
          };
        }

        // return updated status users
        // no change on chat
        return {
          ...chat,
          Users,
        };
      });

      // return updated chats
      // return updated currentChat
      // user status is updated in both objects
      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case FRIEND_OFFLINE: {
      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        const Users = chat.Users.map((user) => {
          if (user.id === parseInt(payload.id)) {
            return { ...user, status: 'offline' };
          }
          return user;
        });

        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...currentChatCopy,
            Users,
          };
        }

        return {
          ...chat,
          Users,
        };
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case SET_SOCKET: {
      return {
        ...state,
        socket: payload,
      };
    }

    // when front create message and back finish on message, back emit received
    case RECEIVED_MESSAGE: {
      const { userId, message } = payload;
      // current chat = open chat
      let currentChatCopy = { ...state.currentChat };
      let newMessage = { ...state.newMessage };
      let scrollBottom = state.scrollBottom;

      const chatsCopy = state.chats.map((chat) => {
        // one user's all chats -> one chat with new message's chat id
        if (message.chatId === chat.id) {
          // change new message props
          // if user who created message = login user
          if (message.User.id === userId) {
            // change value, scroll happen
            // value can be anything
            scrollBottom++;
          } else {
            // update new message state for other users
            newMessage = {
              chatId: chat.id,
              seen: false,
            };
          }

          // if new message is in onpen chat
          if (message.chatId === currentChatCopy.id) {
            currentChatCopy = {
              ...currentChatCopy,
              Messages: [...currentChatCopy.Messages, ...[message]],
            };
          }

          return {
            ...chat,
            Messages: [...chat.Messages, ...[message]],
          };
        }

        return chat;
      });

      if (scrollBottom === state.scrollBottom) {
        return {
          ...state,
          chats: chatsCopy,
          currentChat: currentChatCopy,
          newMessage,
          senderTyping: { typing: false },
        };
      }

      // if login user = user who created message
      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
        newMessage,
        scrollBottom,
        senderTyping: { typing: false },
      };
    }

    case SENDER_TYPING: {
      if (payload.typing) {
        return {
          ...state,
          senderTyping: payload,
          scrollBottom: state.scrollBottom + 1,
        };
      }

      return {
        ...state,
        senderTyping: payload,
      };
    }

    case PAGINATE_MESSAGES: {
      const { messages, id, pagination } = payload;

      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        if (chat.id === id) {
          // latest messages + old messages
          const shifted = [...messages, ...chat.Messages];

          currentChatCopy = {
            ...currentChatCopy,
            Messages: shifted,
            Pagination: pagination,
          };

          return { ...chat, Messages: shifted, Pagination: pagination };
        }

        return chat;
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case INCREMENT_SCROLL: {
      return {
        ...state,
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: true },
      };
    }

    default: {
      return state;
    }
  }
};

export default chatReducer;
