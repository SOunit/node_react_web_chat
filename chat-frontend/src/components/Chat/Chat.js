import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import './Chat.scss';

const Chat = () => {
  const user = useSelector((state) => state.authReducer.user);

  return (
    <div id='chat-container' className='card-shadow'>
      <Navbar />
      <div id='chat-wrap'>Data</div>
    </div>
  );
};

export default Chat;
