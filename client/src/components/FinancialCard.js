import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class FinancialCard extends Component{


    render(){
        return(
            <Container>
            <Row>
            <span className="equity-title">Financials</span> 
            </Row>
            <Row>
              <Col>
                <Row className="semi-title">
                    Opening Price
                </Row>
                <Row>
                    $33.45
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Volume
                </Row>
                <Row>
                    234,034
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Metric
                </Row>
                <Row>
                    135.43
                </Row>
              </Col>
            </Row>
            <Row>
               <Col>
                <Row className="semi-title">
                    Market Cap.
                </Row>
                <Row>
                    1.24 M
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/E Ratio
                </Row>
                <Row>
                    <span> 4.43 </span>
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Debt/Equity
                </Row>
                <Row>
                    <span> 7.36 </span>
                </Row>
              </Col>

            </Row>
            </Container>
        );
    }


}

export default FinancialCard;
