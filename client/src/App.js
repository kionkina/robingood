import React from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Routes from './components/Routes';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends React.Component{
 
  render (){
    return (
      <Routes></Routes>
    );
  }
}

export default App;
