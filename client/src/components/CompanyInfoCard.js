import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';

class CompanyInfoCard extends Component{


    render(){

        return(
            <Container>
                <Row>
            <span className="equity-title">About APPL</span> 
            </Row>
            <Row>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Row>
            <Row>
            <Col>
                <Row className="semi-title">
                    CEO
                </Row>
                <Row>
                    Da Guy Sr.
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Founded
                </Row>
                <Row>
                    1943
                </Row>
              </Col>
            </Row>
            </Container>
        );

    }

}

export default CompanyInfoCard;