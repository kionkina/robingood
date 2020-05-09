import React,{Component} from 'react';

class Error extends Component{
    render(){
        return (
         <div>
             <h1> {this.props.match.params.status} Not Found</h1>
        </div>
        );
    }
}

export default Error;