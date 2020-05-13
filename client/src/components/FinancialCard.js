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
                    Free Cash Flow
                </Row>
                <Row>
                    ${this.marketCap(this.props.stockFinancials.freeCashFlow)}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/B Value
                </Row>
                <Row>
                    {this.props.stockFinancials.priceToBookValue}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/S Ratio
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
                    {this.marketCap(this.props.stockFinancials.marketCapitalization)}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/E Ratio
                </Row>
                <Row>
                    <span> {this.props.stockFinancials.priceToEarningsRatio} </span>
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Debt/Equity
                </Row>
                <Row>
                    <span> {this.props.stockFinancials.debtToEquityRatio} </span>
                </Row>
              </Col>

            </Row>
            </Container>
        );
    }


}

export default FinancialCard;
