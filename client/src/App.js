import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
    </Router>
  );
}

export default App;
