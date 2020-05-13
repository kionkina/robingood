import React from 'react'
import { Provider, Heading, Subhead } from 'rebass'
import {
  Hero, CallToAction, ScrollDownIndicator
} from 'react-landing-page'

class Landing extends React.Component{
    componentDidMount(){
        this.props.history.push('/');
    }
    handleClick = () => {
      this.props.history.push("/register")
    }
  render () {
    return (
      <Provider>
      <Hero
        color="black"
        bg="white"
        //backgroundImage="https://source.unsplash.com/jxaj-UrzQbc/1600x900"
      >
          <Heading>RobinGood</Heading>
          <Subhead>Investing made easy</Subhead>
          <CallToAction onClick={this.handleClick} mt={3}>Get Started</CallToAction>
          <ScrollDownIndicator/>
      </Hero>
    </Provider>
    );
  }
}

export default Landing;
