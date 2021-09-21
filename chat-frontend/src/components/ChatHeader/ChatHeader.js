import { Fragment, useState } from 'react';
import { userStatus } from '../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ChatHeader.scss';

const ChatHeader = ({ chat }) => {
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
  const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);

  return (
    <Fragment>
      <div id='chatter'>
        {chat.Users.map((user) => {
          return (
            <div className='chatter-info' key={user.id}>
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <div className='chatter-status'>
                <span className={`online-status ${userStatus(user)}`}></span>
              </div>
            </div>
          );
        })}
      </div>
      <FontAwesomeIcon
        onClick={() => setShowChatOptions((prevState) => !prevState)}
        icon={['fas', 'ellipsis-v']}
        className='fa-icon'
      />
      {showChatOptions ? (
        <div id='settings'>
          <div>
            <FontAwesomeIcon icon={['fas', 'user-plus']} className='fa-icon' />
            <p>Add user to chat</p>
          </div>

          {chat.type === 'group' ? (
            <div>
              <FontAwesomeIcon
                icon={['fas', 'sign-out-alt']}
                className='fa-icon'
              />
              <p>Leave chat</p>
            </div>
          ) : null}

          <div>
            <FontAwesomeIcon icon={['fas', 'trash']} className='fa-icon' />
            <p>Delete chat</p>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default ChatHeader;
