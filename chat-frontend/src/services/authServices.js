import API from './api';

const AuthService = {
  login: (data) => {
    return API.post('/login', data)
      .then(({ data }) => {
        setHeadersAndStrage(data);
        return data;
      })
      .catch((err) => {
        console.log('Auth service error', err);
        throw err;
      });
  },
  register: (data) => {
    return API.post('/register', data)
      .then(({ data }) => {
        setHeadersAndStrage(data);
        return data;
      })
      .catch((err) => {
        console.log('Auth service error', err);
        throw err;
      });
  },
  logout: () => {
    API.defaults.headers['Authorization'] = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

const setHeadersAndStrage = ({ user, token }) => {
  API.defaults.headers['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export default AuthService;
