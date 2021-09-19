import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat/Chat';
import ProtectedRoute from './components/Router/ProtectedRoute';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSmile, faImage } from '@fortawesome/free-regular-svg-icons';
import {
  faSpinner,
  faEllipsisV,
  faUserPlus,
  faSignOutAlt,
  faTrash,
  faCaretDown,
  faUpload,
  faTimes,
  faBell,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faSmile,
  faEllipsisV,
  faUserPlus,
  faSignOutAlt,
  faTrash,
  faCaretDown,
  faUpload,
  faTimes,
  faBell,
  faImage,
  faSpinner
);

function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <ProtectedRoute path='/' component={Chat} exact />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route exact render={() => <h1>404 page not found</h1>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
