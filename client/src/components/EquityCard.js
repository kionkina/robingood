import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class EquityCard extends Component{



    render(){

        return(
            <Container>
            <Row>
            <span className="equity-title">Your Position</span> 
            </Row>
            <Row>
              <Col>
                <Row className="semi-title">
                    Shares
                </Row>
                <Row>
                    2
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Buy Price
                </Row>
                <Row>
                    $37.15
                </Row>
              </Col>
            </Row>
            <Row>
            <Col>
                <Row className="semi-title">
                    Equity
                </Row>
                <Row>
                    $45.23
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Total Return
                </Row>
                <Row>
                    <span className="g"> $8.08 (19.45%) </span>
                </Row>
              </Col>
            </Row>
            </Container>
        );


    }


}

export default EquityCard;