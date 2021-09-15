import LoginImage from '../../assets/images/login.svg';

import './Auth.scss';

const Login = () => {
  return (
    <div>
      <div id='auth-container'>
        <div id='auth-card'>
          <div>
            <div id='image-section'>
              <img src={LoginImage} alt='login' />
            </div>
            <div id='form-section'>
              <h2>Welcome back</h2>
              <form>
                <div className='input-field'>
                  <input placeholder='email' />
                </div>
                <div className='input-field'>
                  <input placeholder='password' />
                </div>
                <button>LOGIN</button>
              </form>
              <p>Don't have an account? Register</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
