import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';
import ReactSearchBox from 'react-search-box'
import { withRouter } from 'react-router-dom';
class Navbar extends Component{
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            search: "",
        }
      }

      componentDidMount(){
          console.log("aaa")
          console.log(this.props)
      }
    onClickLogoutHandler = ()=>{
        AuthService.logout().then(data=>{
            // setUser(data.user);
            this.context.setUser({})
            this.context.setIsAuthenticated(false);
        });
    }

    handleChange = (e)=>{
        this.setState({
            search:e.target.value
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        console.log(this.state.search)
        this.props.history.push({
            pathname: `/stock/` + this.state.search,
            state: {user: this.context.user, stockticker: this.state.search}
        })
    }
    render(){

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
            return(
                <>
                    {/* <ReactSearchBox
                        placeholder="Placeholder"
                        value="Doe"
                        data={data}
                        callback={record => console.log(record)}
                    /> */}
                    <form onSubmit={this.handleSubmit}>
                    <input class="customForm form-control" type="text" placeholder="Search" aria-label="Search" onSubmit={this.handleSubmit} onChange={this.handleChange}></input>
                    </form>

                    {/* <input type="submit" value="Search" /> */}
                    <Link to="/">
                        <li className="nav-item nav-link">
                            Home
                        </li>
                    </Link> 
    
                    {
                        this.context.user.role === "admin" ? 
                        <Link to="/admin">
                            <li className="nav-item nav-link">
                                Admin
                            </li>
                        </Link> : null
                    }  
                    <button type="button" 
                            className="btn btn-link nav-item nav-link" 
                            onClick={this.onClickLogoutHandler}>Logout</button>
                </>
            )
        }
        return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <Link to="/">
                <div className="navbar-brand">Robin<span style={{color:"#2EBE33"}}>Good</span></div>
            </Link>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav ml-auto">
                    { !this.context.isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
                </ul>
            </div>
        </nav>
        );
    }
}

export default withRouter(Navbar);