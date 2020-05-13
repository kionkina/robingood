import { AuthContext } from "../context/AuthContext";

export default {
    login: user => {
        console.log(user);
        console.log(JSON.stringify(user));
        return fetch('/api/login', {
            method: "post",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 401) {
                // console.log(res.json().then(data => data));
                return res.json().then(data => data);
            }
            else {
                return { isAuthenticated: false, user: { username: "" } };
            }
        })
            .catch(err => {
                console.log(err)
            })
    },
    register: user => {
        console.log(user);
        return fetch('/api/register', {
            method: "post",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => data);
    },
    logout: () => {
        return fetch('/api/logout', {
            method: "get",
        })
            .then(res => res.json())
            .then(data => data);
    },
    isAuthenticated: () => {
        return fetch('/api/authenticated')
            .then(res => {
                if (res.status !== 401)
                    return res.json().then(data => data);
                 else 
                    return { isAuthenticated: false, user: { username: "" } };
            });
    }

}