import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class EquityCard extends Component{
    constructor(props) {
        super(props);
      }


    render(){
        let profit = {};
        if(this.props.stock && this.props.stock.totalReturn > 0){
            profit = { color: 'green' }
        }
        if(this.props.stock && this.props.stock.totalReturn < 0){
            profit = { color: 'red' }
        }
        return(
            <Container className={this.props.lock ? "lock" : ""}>
               {this.props.lock ? <span className="lockText">Purchase a stock first!</span> :<> </> }
            <Row>
            <span className="equity-title">Your Position</span> 
            </Row>
            <Row>
              <Col>
                <Row className="semi-title">
                    Shares
                </Row>
                <Row>
                    {this.props.stock ? this.props.stock.quantity : 0}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Avg. Cost
                </Row>
                <Row>
                    {this.props.stock? this.props.buyPrice : 0}
                </Row>
              </Col>
            </Row>
            <Row>
            <Col>
                <Row className="semi-title">
                    Equity
                </Row>
                <Row>
                    ${this.props.stock ? (this.props.stock.currentPrice * this.props.stock.quantity).toFixed(2) : 0}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Total Return
                </Row>
                <Row>
                  {this.props.stock ? 
                    <span style={profit}> ${this.props.stock.totalReturn} ({this.props.stock.totalReturnPercentage}%) </span>
                  : 0}
                    
                </Row>
              </Col>
            </Row>
            </Container>
        );


    }


}

export default EquityCard;