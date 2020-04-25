import React, {useState,useContext} from 'react';
import AuthService from '../services/AuthService';
import Message from '../components/Message';
import {AuthContext} from '../context/AuthContext';

const Login = props=>{
    const [user,setUser] = useState({email: "", password : ""});
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const onSubmit = e =>{
        e.preventDefault();
        AuthService.login(user).then(data=>{
            console.log(data);
            const { isAuthenticated,user,message} = data;
            if(isAuthenticated){
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/todos');
            }
            else
                setMessage(message);
        });
    }

    const showPass = () => {
        var pass = document.getElementById("password");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
      }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please sign in</h3>
                <label htmlFor="email" className="sr-only">Email: </label>
                <input type="email" 
                       name="email" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Email"/>
                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       id="password"
                       name="password" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"/>
                <input type="checkbox" onClick={showPass}></input><label for='show-password'>Show Password</label>
                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Log in </button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Login;