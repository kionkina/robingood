import React, {useState,useRef,useEffect} from 'react';
import AuthService from '../services/AuthService';
import Message from '../components/Message';

const Register = props=>{
    const [user,setUser] = useState({email: "", password : "", role : ""});
    const [message,setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const resetForm = ()=>{
        setUser({email : "", password : "",role : ""});
    }

    const showPass = () => {
        var pass = document.getElementById("password");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
      }

    const onSubmit = e =>{
        e.preventDefault();
        AuthService.register(user).then(data=>{
            const { message } = data;
            setMessage(message);
            resetForm();
            if(!message.msgError){
                timerID = setTimeout(()=>{
                    props.history.push('/login');
                },2000)
            }
        });
    }



    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please Register</h3>
                <label htmlFor="email" className="sr-only">Email: </label>
                <input type="text" 
                       name="email" 
                       value={user.email}
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Email"/>
                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       id="password"
                       name="password"
                       value={user.password} 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"/>
                {/* <label htmlFor="role" className="sr-only">Role: </label>
                <input type="text" 
                       name="role"
                       value={user.role}  
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter role (admin/user)"/> */}
                <input type="checkbox" onClick={showPass}></input><label for='show-password'>Show Password</label>
                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Register</button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Register;