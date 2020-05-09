import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';
import ReactSearchBox from 'react-search-box'

const Navbar = props =>{
    const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
    
    const onClickLogoutHandler = ()=>{
        AuthService.logout().then(data=>{
            // setUser(data.user);
            setUser({})
            setIsAuthenticated(false);
        });
    }

    const unauthenticatedNavBar = ()=>{
        return (
            <>
                <Link to="/">
                    <li className="nav-item nav-link">
                        Home
                    </li>
                </Link>  
                <Link to="/login">
                    <li className="nav-item nav-link">
                        Login
                    </li>
                </Link>  
                <Link to="/register">
                    <li className="nav-item nav-link">
                        Register
                    </li>
                </Link>  
            </>
        )
    }

    const authenticatedNavBar = ()=>{
        // const data = [
        //     {
        //       key: 'john',
        //       value: 'John Doe',
        //     },
        //     {
        //       key: 'jane',
        //       value: 'Jane Doe',
        //     },
        //     {
        //       key: 'mary',
        //       value: 'Mary Phillips',
        //     },
        //     {
        //       key: 'robert',
        //       value: 'Robert',
        //     },
        //     {
        //       key: 'karius',
        //       value: 'Karius',
        //     },
        //   ]

        return(
            <>
                {/* <ReactSearchBox
                    placeholder="Placeholder"
                    value="Doe"
                    data={data}
                    callback={record => console.log(record)}
                /> */}
                <input class="customForm form-control" type="text" placeholder="Search" aria-label="Search"></input>
                <Link to="/">
                    <li className="nav-item nav-link">
                        Home
                    </li>
                </Link> 
                <Link to="/todos">
                    <li className="nav-item nav-link">
                        Todos
                    </li>
                </Link> 
                {
                    user.role === "admin" ? 
                    <Link to="/admin">
                        <li className="nav-item nav-link">
                            Admin
                        </li>
                    </Link> : null
                }  
                <button type="button" 
                        className="btn btn-link nav-item nav-link" 
                        onClick={onClickLogoutHandler}>Logout</button>
            </>
        )
    }
    return(
        <nav className="navbar navbar-expand-lg navbar-light">
            <Link to="/">
                <div className="navbar-brand">Robin<span style={{color:"#2EBE33"}}>Good</span></div>
            </Link>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav ml-auto">
                    { !isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;