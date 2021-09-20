import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChat } from '../../store/actions/chat';
import Friend from '../Friend/Friend';
import './FriendList.scss';

const FriendList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chatReducer.chats);

  const openChat = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  return (
    <div id='friends'>
      <div id='title'>
        <h3 className='m-0'>Friends</h3>
        <button>ADD</button>
      </div>
      <hr />
      <div id='friends-box'>
        {chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <Friend click={() => openChat(chat)} chat={chat} key={chat.id} />
            );
          })
        ) : (
          <p id='no-chat'>No friends added</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
