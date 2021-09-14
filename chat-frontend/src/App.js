import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat/Chat';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/' component={Chat} exact />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route exact render={() => <h1>404 page not found</h1>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
