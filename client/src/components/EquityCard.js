import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class EquityCard extends Component{
    constructor(props) {
        super(props);
      }


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
                    {this.props.stock.quantity}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Avg. Cost
                </Row>
                <Row>
                    {this.props.stock.buyPrice}
                </Row>
              </Col>
            </Row>
            <Row>
            <Col>
                <Row className="semi-title">
                    Equity
                </Row>
                <Row>
                    ${this.props.stock.currentPrice * this.props.stock.quantity}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Total Return
                </Row>
                <Row>
                    <span className="g"> ${this.props.stock.totalReturn} ({this.props.stock.totalReturnPercentage * 100}%) </span>
                </Row>
              </Col>
            </Row>
            </Container>
        );


    }


}

export default EquityCard;