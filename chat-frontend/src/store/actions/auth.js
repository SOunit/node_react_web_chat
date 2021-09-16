import AuthService from '../../services/authServices';
export const LOGIN = 'LOGIN';

export const login = (params) => (dispatch) => {
  return AuthService.login(params)
    .then((data) => {
      console.log(data);
      dispatch({
        type: LOGIN,
        payload: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
