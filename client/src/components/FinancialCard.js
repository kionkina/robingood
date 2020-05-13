import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'
import axios from 'axios'

class FinancialCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
          stockFinancials: undefined,
        }
      }
    componentDidMount(){
        axios.get('/stockinfo/financials/' + this.props.ticker).then(res =>{
            console.log(res);
            this.setState({
                stockFinancials: res.data
            })
        })
        .catch(err => {
            console.log(err)
        });
    }

    marketCap = (labelValue) => {

        return Math.abs(Number(labelValue)) >= 1.0e+12
    
        ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + " T"
        : Math.abs(Number(labelValue)) >= 1.0e+9
    
        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " B"
        : Math.abs(Number(labelValue)) >= 1.0e+6
    
        ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " M"
    
        : Math.abs(Number(labelValue));
    
    }
    render(){
        return(<div>
            {this.state.stockFinancials ?
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
                    ${this.marketCap(this.state.stockFinancials.freeCashFlow)}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/B Value
                </Row>
                <Row>
                    {this.state.stockFinancials.priceToBookValue}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/S Ratio
                </Row>
                <Row>
                    {this.state.stockFinancials.priceToSalesRatio}
                </Row>
              </Col>
            </Row>
            <Row>
               <Col>
                <Row className="semi-title">
                    Market Cap.
                </Row>
                <Row>
                    {this.marketCap(this.state.stockFinancials.marketCapitalization)}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    P/E Ratio
                </Row>
                <Row>
                    <span> {this.state.stockFinancials.priceToEarningsRatio} </span>
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    Debt/Equity
                </Row>
                <Row>
                    <span> {this.state.stockFinancials.debtToEquityRatio} </span>
                </Row>
              </Col>

            </Row>
            </Container>
            : <></> }
            </div>
        );
    }


}

export default FinancialCard;
