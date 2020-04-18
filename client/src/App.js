import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import withAuth from './withAuth';
import Secret from './Secret';

class App extends React.Component{
 
  render (){
    return (
    <div className="App">
      <Link to="/login">Login</Link>
      <Link to="/secret"> Token-Protected Link </Link>
      <Switch>
       <Route path="/Login" component={Login} />
       <Route path="/secret" component={withAuth(Secret)} />
       </Switch>
    </div>
    );
  }
}

export default withRouter(App);
