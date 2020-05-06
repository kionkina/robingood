import React, {useContext} from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Landing from './Landing';
import Register from './Register';
import StockPage from './StockPage';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Routes = props =>{
    const {isAuthenticated} = useContext(AuthContext);
    //const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
    
    return(
        <div>
            <Router>
                <Navbar/>
                {!isAuthenticated && (
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route exact path="/stock" component={StockPage}/>
                        <Route component={Landing} />
                    </Switch>
                )}
                {isAuthenticated && (
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/stock" component={StockPage}/>
                    </Switch>
                )}
            </Router>
        </div>
    )
}

export default Routes;