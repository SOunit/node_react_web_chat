import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Message from '../Message/Message';
import './MessageBox.scss';

const MessengeBox = ({ chat }) => {
  const user = useSelector((state) => state.authReducer.user);
  const scrollBottom = useSelector((state) => state.chatReducer.scrollBottom);
  const msgBox = useRef();

  useEffect(() => {
    setTimeout(() => {
      scrollManual(msgBox.current.scrollHeight);
    }, 100);
  }, [scrollBottom]);

  const scrollManual = (value) => {
    msgBox.current.scrollTop = value;
  };

  return (
    <div id='msg-box' ref={msgBox}>
      {chat.Messages.map((message, index) => {
        return (
          <Message
            user={user}
            key={message.id}
            chat={chat}
            message={message}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default MessengeBox;
