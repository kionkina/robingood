import React, { Component } from 'react';


export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : '',
      password: ''
    };
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  /*
  onSubmit = (event) => {
    event.preventDefault();
    $.ajax({
      type:'post',
      url: '/api/authenticate',
      data: JSON.stringify(this.state),
      success: function(output, status, xhr){
        alert(xhr.getResponseHeader('Set-Cookie'));
      }})};*/


 onSubmit = (event) => {
      event.preventDefault();  
      fetch('/api/authenticate', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          console.log(res.headers.get('set-cookie'));
          console.log(res.Cookie);
          console.log(res.Cookies);
            console.log("here");
          this.props.history.push('/');
          console.log("PUSHED!!!");
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
    }


  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Login Below!</h1>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={this.state.password}
          onChange={this.handleInputChange}
          required
        />
       <input type="submit" value="Submit"/>
      </form>
    );
  }
}

