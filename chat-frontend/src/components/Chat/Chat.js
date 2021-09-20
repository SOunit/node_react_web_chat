import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import { fetchChats } from '../../store/actions/chat';
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
      <div id='chat-wrap'>Data</div>
    </div>
  );
};

export default Chat;
