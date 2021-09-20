import './Friend.scss';

const Friend = ({ chat }) => {
  return (
    <div>
      <p>
        {chat.Users[0].firstName} {chat.Users[0].lastName}
      </p>
    </div>
  );
};

export default Friend;
