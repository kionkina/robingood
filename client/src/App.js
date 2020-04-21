import React from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register'
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends React.Component{
 
  render (){
    return (
    <Router>
      <Navbar/>
      <Route exact path="/" component={Home}/>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Router>
    );
  }
}

export default App;
