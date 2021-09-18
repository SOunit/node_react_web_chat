import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import registerImage from '../../assets/images/register.svg';
import { register } from '../../store/actions/auth';

import './Auth.scss';

const Register = ({ history }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [password, setPassword] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    // AuthService.login({ email, password }).then((res) => console.log(res));
    // console.log({ email, password });
    dispatch(
      register({ firstName, lastName, email, gender, password }, history)
    );
  };

  return (
    <div id='auth-container'>
      <div id='auth-card'>
        <div className='card-shadow'>
          <div id='image-section'>
            <img src={registerImage} alt='register' />
          </div>
          <div id='form-section'>
            <h2>Create an account</h2>
            <form onSubmit={submitForm}>
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
              <button>REGISTER</button>
            </form>
            <p>
              Already have an account? <Link to='/login'>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
