//currently unused

import React, { Component, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
// import AuthService from '/services/AuthService';
import { AuthContext } from '../context/AuthContext';
export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
      // console.log("about to fetch...");
      // axios.get('/api/checkToken')
      //   .then(res => {
      //     if (res.status === 200) {
      //         console.log("CHECK TOKEN RETURNED 200")
      //       this.setState({ loading: false });
      //     } else {
      //       console.log("error");
      //       const error = new Error(res.error);
      //       throw error;
      //     }
      //   })
      //   .catch(err => {
      //     console.error(err);
      //     this.setState({ loading: false, redirect: true });
      //   });
      if(isAuthenticated){
        this.setState({ loading: false})
      }
      else{
        this.setState({ loading: false, redirect: true})
      }
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  }
}