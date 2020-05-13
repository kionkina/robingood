import React, {useContext} from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Landing from './Landing';
import Register from './Register';
import StockPage from './StockPage';
import PortfolioPage from './PortfolioPage';
import Error from './Error';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Routes = props =>{
    //console.log(useContext(AuthContext))
    const {user, isAuthenticated} = useContext(AuthContext);
    console.log("USER");
    console.log(user);
    //const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
    
    return(
        <div>
            <Router>
                <Navbar/>
                {!isAuthenticated && (
                    <Switch>
                        <Route path="/" component={Login}></Route>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route exact path="/stock" component={StockPage}/>
                        <Route component={Landing} />
                    </Switch>
                )}
                {isAuthenticated && (
                    <Switch>
                        <Route exact path="/"
                        render={(props) => <Home {...props} user={user} />}
                        />
                        <Route exact path="/stock/:ticker" component={StockPage}
                        />
                        <Route path="/portfolio" component={PortfolioPage}/>
                        <Route path="/error/:status" component={Error}/>
                        <Route component={Error}/>
                    </Switch>
                )}
            </Router>
        </div>
    )
}

export default Routes;