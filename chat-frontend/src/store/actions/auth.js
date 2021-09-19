import AuthService from '../../services/authServices';
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const login = (params, history) => (dispatch) => {
  return AuthService.login(params)
    .then((data) => {
      console.log(data);
      dispatch({
        type: LOGIN,
        payload: data,
      });
      history.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const register = (params, history) => (dispatch) => {
  return AuthService.register(params)
    .then((data) => {
      console.log(data);
      dispatch({
        type: LOGIN,
        payload: data,
      });
      history.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const logout = () => (dispatch) => {
  AuthService.logout();
  dispatch({ type: LOGOUT });
};

export const updateProfile = (params) => (dispatch) => {
  return AuthService.updateProfile(params)
    .then((data) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
