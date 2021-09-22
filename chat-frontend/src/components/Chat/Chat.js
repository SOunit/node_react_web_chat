import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats } from '../../store/actions/chat';
import useSocket from './hooks/socketConnect';
import Navbar from './components/Navbar';
import FriendList from '../FriendList/FriendList';
import Messenger from '../Messenger/Messenger';
import './Chat.scss';

const Chat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  useSocket(user, dispatch);

  // move logic to socketConnect.js to avoid error by socket process deley
  // useEffect(() => {
  //   dispatch(fetchChats())
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  // }, [dispatch]);

  return (
    <div id='chat-container' className='card-shadow'>
      <Navbar />
      <div id='chat-wrap'>
        <FriendList />
        <Messenger />
      </div>
    </div>
  );
};

export default Chat;
