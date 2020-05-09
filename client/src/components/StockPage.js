import React,{Component} from 'react';
import axios from 'axios'
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import EquityCard from './EquityCard';
import FinancialCard from './FinancialCard';
import PurchaseCard from './PurchaseCard';
import CompanyInfoCard from './CompanyInfoCard'

class StockPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
          user: this.props.user,
          stockInfo: undefined
        }
      }

    componentDidMount(){
        axios.get('/stockInfo/metaData/' + this.props.match.params.ticker).then(resb => {
            axios.get('/stockInfo/stock/' + this.props.match.params.ticker).then(resc => {
                console.log(({...resb.data, ...resc.data}))
                this.setState({
                    stockInfo: ({...resb.data, ...resc.data})
                })
                //console.log(hotstocks)
            })
            .catch(errc => {
                //console.log(errc)
                if(errc.response){
                    console.log(errc.response)
                    this.props.history.push(`/error/` + errc.response.status)
                }
            })
        })
        .catch(errb => {
            //console.log(errb)
            if(errb.response){
                console.log(errb.response)
                this.props.history.push(`/error/` + errb.response.status)
            }
        })
    }



    render(){
        return(
        <Container>
            {this.state.stockInfo ? 
        <Row className="stockp-row">
            <Col md="8" >
                <Row className="stock-title">
                 <Col> 
                    {this.state.stockInfo.name} - {this.state.stockInfo.ticker}
                </Col>  
                </Row>
                <Row className="chart-price semi-title">
                <Col>
                    ${this.state.stockInfo.lastPrice}
                </Col>
                </Row>
                <Row className="stock-chart">

                </Row>
                <Row className="equity">
                    <Col md="6" className="justify-content-center align-items-middle">
                        <EquityCard /> 
                    </Col>
                    <Col md="6">
                        <FinancialCard /> 
                    </Col>
                </Row>
            </Col>
            <Col md="4">
                <Row className="pcard" >
                    <PurchaseCard user={this.props.user} stockInfo={this.state.stockInfo} buy={true}/>
                </Row>
                <Row className="pcard">
                    <PurchaseCard user={this.props.user} stockInfo={this.state.stockInfo} buy={false}/> 
                </Row>
                <Row className="pcard">
                    <CompanyInfoCard description={this.state.stockInfo.description}/>
                </Row>    
            </Col>
        </Row>
            : <></>
    }
        <Row className="news justify-content-center">
            <Card className="news-card border-0">
              <Card.Header as="h5">Current News</Card.Header>
                <Card.Body>
                    
                </Card.Body>
            </Card> 
        </Row>
        </Container>
        );
    }

}

export default StockPage;