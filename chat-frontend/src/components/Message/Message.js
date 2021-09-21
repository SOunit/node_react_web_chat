import './Message.scss';

const Message = ({ user, chat, message, index }) => {
  const determineMargin = () => {
    if (index + 1 === chat.Messages.length) {
      return;
    }

    return message.fromUserId === chat.Messages[index + 1].fromUserId
      ? 'mb-5'
      : 'mb-10';
  };

  return (
    <div
      className={`message ${determineMargin()} ${
        message.fromUserId === user.id ? 'creator' : ''
      }`}
    >
      <div
        className={message.fromUserId === user.id ? 'owner' : 'other-person'}
      >
        {message.type === 'text' ? (
          <p className='m-0'>{message.message}</p>
        ) : (
          <img src={message.message} alt='User upload' />
        )}
      </div>
    </div>
  );
};

export default Message;
