import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/AuthRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">
          <MenuBar/>
          <Route exact path="/" component={Home}/>
          <AuthRoute exact path="/login" component={Login}/>
          <AuthRoute exact path="/register" component={Register}/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
