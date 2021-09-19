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

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const submitForm = (e) => {
    e.preventDefault();

    const form = { firstName, lastName, email, gender, password, avatar };

    const formData = new FormData();

    for (const key in form) {
      formData.push(key, form[key]);
    }
  };

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
            <Fragment key='header'>
              <h3 className='m-0'>Update profile</h3>
            </Fragment>
            <Fragment key='body'>
              <form>
                <div className='input-field mb-1'>
                  <input
                    placeholder='First name'
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    required='required'
                    type='text'
                  />
                </div>
                <div className='input-field mb-1'>
                  <input
                    placeholder='Last name'
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required='required'
                    type='text'
                  />
                </div>
                <div className='input-field mb-1'>
                  <input
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required='required'
                    type='text'
                  />
                </div>
                <div className='input-field mb-1'>
                  <select
                    onChange={(e) => setGender(e.target.value)}
                    value={gender}
                    required='required'
                  >
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </select>
                </div>
                <div className='input-field mb-2'>
                  <input
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required='required'
                    type='password'
                  />
                </div>
                <div className='input-field mb-2'>
                  <input
                    onChange={(e) => setAvatar(e.target.files[0])}
                    type='file'
                  />
                </div>
              </form>
            </Fragment>
            <Fragment key='footer'>
              <button className='btn-success'>UPDATE</button>
            </Fragment>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Navbar;
