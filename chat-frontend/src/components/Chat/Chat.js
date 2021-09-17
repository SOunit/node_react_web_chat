import { useSelector } from 'react-redux';

const Chat = () => {
  const user = useSelector((state) => state.authReducer.user);

  return (
    <div>
      Chat Screen
      <p>Welcome {user.firstName}</p>
    </div>
  );
};

export default Chat;
