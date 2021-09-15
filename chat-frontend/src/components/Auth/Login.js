import { Link } from 'react-router-dom';
import loginImage from '../../assets/images/login.svg';

import './Auth.scss';

const Login = () => {
  return (
    <div id='auth-container'>
      <div id='auth-card'>
        <div className='card-shadow'>
          <div id='image-section'>
            <img src={loginImage} alt='login' />
          </div>
          <div id='form-section'>
            <h2>Welcome back</h2>
            <form>
              <div className='input-field mb-1'>
                <input placeholder='email' />
              </div>
              <div className='input-field mb-2'>
                <input placeholder='password' />
              </div>
              <button>LOGIN</button>
            </form>
            <p>
              Don't have an account? <Link to='/register'>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
