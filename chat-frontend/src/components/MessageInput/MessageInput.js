import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatService from '../../services/chatService';
import './MessageInput.scss';

const MessengeInput = ({ chat }) => {
  const user = useSelector((state) => state.authReducer.user);
  const socket = useSelector((state) => state.chatReducer.socket);

  const fileUpload = useRef();

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
      fromUser: user,
      toUserId: chat.Users.map((user) => user.id),
      chatId: chat.id,
      message: imageUpload ? imageUpload : message,
    };

    setMessage('');
    setImage('');

    // send message with socket
    socket.emit('message', msg);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('id', chat.id);
    formData.append('image', image);

    // chat service
    ChatService.uploadImage(formData)
      .then((image) => {
        sendMessage(image);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div id='input-container'>
      <div id='image-upload-container'>
        <div></div>
        <div id='image-upload'>
          {image && image.name ? (
            <div id='image-details'>
              <p className='m-0'>{image.name}</p>
              <FontAwesomeIcon
                onClick={() => handleImageUpload()}
                icon='upload'
                className='fa-icon'
              />
              <FontAwesomeIcon
                onClick={() => setImage('')}
                icon='times'
                className='fa-icon'
              />
            </div>
          ) : null}
          <FontAwesomeIcon
            onClick={() => fileUpload.current.click()}
            icon={['far', 'image']}
            className='fa-icon'
          />
        </div>
      </div>
      <div id='message-input'>
        <input
          value={message}
          type='text'
          placeholder='Message...'
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />
        <FontAwesomeIcon icon={['far', 'smile']} className='fa-icon' />
      </div>
      <input
        id='chat-image'
        ref={fileUpload}
        type='file'
        onChange={(e) => setImage(e.target.files[0])}
      />
    </div>
  );
};

export default MessengeInput;
