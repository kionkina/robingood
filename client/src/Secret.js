import React from 'react';

export default class Secret extends React.Component {
  constructor() {
    super();
    //Set default message
    this.state = {
      message: 'Loading...'
    }
  }
  componentDidMount() {
    //GET message from server using fetch api
    fetch('/api/home')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }
  render() {
    return (
      <div>
        <h1>Home</h1>
        <h2>This page is only accessible with an auth jwt token!</h2>
        <p>{this.state.message}</p>
      </div>
    );
  }
}