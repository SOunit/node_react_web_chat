import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './MessageInput.scss';

const MessengeInput = ({ chat }) => {
  const user = useSelector((state) => state.authReducer.user);

  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

  const handleMessage = (e) => {
    const message = e.target.value;
    setMessage(message);

    // notify other user that this user is typing something...
  };

  const handleKeyDown = (e, imageUpload) => {
    if (e.key === 'Enter') {
      sendMessage(imageUpload);
    }
  };

  const sendMessage = (imageUpload) => {
    if (message.length < 1 && !imageUpload) {
      return;
    }

    const msg = {
      type: imageUpload ? 'image' : 'text',
      fromUserId: user.id,
      toUserId: chat.Users.map((user) => user.id),
      chat: chat.id,
      message: imageUpload ? image : message,
    };

    setMessage('');
    setImage('');

    // send message with socket
  };

  return (
    <div id='input-container'>
      <div id='message-input'>
        <input
          type='text'
          placeholder='Message...'
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />
        <FontAwesomeIcon icon={['far', 'smile']} className='fa-icon' />
      </div>
    </div>
  );
};

export default MessengeInput;
