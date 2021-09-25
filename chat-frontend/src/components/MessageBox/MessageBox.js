import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../Message/Message';
import { paginateMessages } from '../../store/actions/chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MessageBox.scss';

const MessengeBox = ({ chat }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const scrollBottom = useSelector((state) => state.chatReducer.scrollBottom);
  const senderTyping = useSelector((state) => state.chatReducer.senderTyping);
  const [loading, setLoading] = useState(false);
  const msgBox = useRef();

  useEffect(() => {
    setTimeout(() => {
      scrollManual(msgBox.current.scrollHeight);
    }, 100);
  }, [scrollBottom]);

  const scrollManual = (value) => {
    msgBox.current.scrollTop = value;
  };

  const handleInfiniteScroll = (e) => {
    // if user scroll to top
    if (e.target.scrollTop === 0) {
      setLoading(true);
      const pagination = chat.Pagination;
      const page = typeof pagination === 'undefined' ? 1 : pagination.page;

      dispatch(paginateMessages(chat.id, parseInt(page) + 1))
        .then((res) => {
          if (res) {
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  return (
    <div onScroll={handleInfiniteScroll} id='msg-box' ref={msgBox}>
      {loading ? (
        <p className='loader m-0'>
          <FontAwesomeIcon icon='spinner' className='fa-spin' />
        </p>
      ) : null}
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
      {senderTyping.typing && senderTyping.chatId === chat.id ? (
        <div className='message'>
          <div className='other-person'>
            <p className='m-0'>
              {senderTyping.fromUser.firstName} {senderTyping.fromUser.lastName}
              ...
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MessengeBox;
