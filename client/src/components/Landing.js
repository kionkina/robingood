import React from 'react';

class Landing extends React.Component{
    componentDidMount(){
        this.props.history.push('/');
    }
  render () {
    return (
        <div>
            <h1>Not logged in landing page</h1>
        </div>
    );
  }
}

export default Landing;
