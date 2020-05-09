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
                {this.props.description}
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