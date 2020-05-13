import React from 'react'
import { Provider, Heading, Subhead } from 'rebass'
import {
  Hero, CallToAction, ScrollDownIndicator
} from 'react-landing-page'

class Landing extends React.Component{
    componentDidMount(){
        this.props.history.push('/');
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
          <CallToAction href="/getting-started" mt={3}>Get Started</CallToAction>
          <ScrollDownIndicator/>
      </Hero>
    </Provider>
    );
  }
}

export default Landing;
