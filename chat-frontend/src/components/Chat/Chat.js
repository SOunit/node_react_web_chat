import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats } from '../../store/actions/chat';
import Navbar from './components/Navbar';
import FriendList from '../FriendList/FriendList';
import Messenger from '../Messenger/Messenger';
import './Chat.scss';

const Chat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, [dispatch]);

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
