import React, {useContext} from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Landing from './Landing';
import Register from './Register';
import {Redirect, BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const Routes = props =>{
    const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
    
    return(
        <div>
            <Router>
                <Navbar/>
                {!isAuthenticated && (
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route component={Landing} />
                    </Switch>
                )}
                {isAuthenticated && (
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/todos" component={Home}/>
                    </Switch>
                )}
            </Router>
        </div>
    )
}

export default Routes;