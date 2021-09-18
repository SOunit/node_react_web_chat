import { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../../store/actions/auth';
import Modal from '../../Modal/Modal';
import './Navbar.scss';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div id='navbar'>
      <h2>Chat.io</h2>
      <div
        onClick={() => setShowProfileOptions((prevState) => !prevState)}
        id='profile-menu'
      >
        <img width='40px' height='40px' src={user.avatar} alt='Avatar' />
        <p>
          {user.firstName} {user.lastName}
        </p>
        <FontAwesomeIcon icon='caret-down' className='fa-icon' />

        {showProfileOptions && (
          <div id='profile-options'>
            <p
              onClick={() => {
                setShowProfileModal(true);
              }}
            >
              Update profile
            </p>
            <p
              onClick={() => {
                dispatch(logout());
              }}
            >
              Logout
            </p>
          </div>
        )}

        {showProfileModal && (
          <Modal click={() => setShowProfileModal(false)}>
            <Fragment key='header'>Modal Header 1</Fragment>
            <Fragment key='body'>Modal Body 2</Fragment>
            <Fragment key='footer'>Modal Footer 3</Fragment>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Navbar;
