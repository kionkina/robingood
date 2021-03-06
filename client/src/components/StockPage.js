import React,{Component} from 'react';
import axios from 'axios';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import EquityCard from './EquityCard';
import FinancialCard from './FinancialCard';
import PurchaseCard from './PurchaseCard';
import CompanyInfoCard from './CompanyInfoCard';
import Article from './Article';
import TradingViewWidget from 'react-tradingview-widget';
import {AuthContext} from '../context/AuthContext'

class StockPage extends Component{
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
          //user: this.props.user,
          stockInfo: undefined,
          hasStock: [],
          news: [],
        }
      }

      componentWillReceiveProps(nextProps){
        if(this.props.location.state.stockticker != nextProps.location.state.stockticker){
            this.getStockInfo(nextProps.location.state.stockticker)
        }
      }
    componentDidMount(){
        this.getStockInfo(this.props.match.params.ticker)
    }

    getStockInfo = (ticker) => {
        axios.get('/stockInfo/metaData/' + ticker).then(resb => {
            axios.get('/stockInfo/stock/' + ticker).then(resc => {
                let stockinfo = {...resb.data, ...resc.data}
                console.log(stockinfo)
                let hasstock = this.context.user.stocks.filter(stock => stock.ticker === stockinfo.ticker)
                console.log(hasstock)
                console.log("hello")
                this.setState({
                    stockInfo: stockinfo,
                    hasStock: hasstock
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
        });
    axios.get('/stockInfo/news/' + ticker).then(res =>{
            console.log(res);
            this.setState({
                news: res.data.news
            })
        })
        .catch(err => {
            console.log(err)
            this.props.history.push(`/error/` + err.status)
        });
    }

    render(){
        return(
        <Container>
            {this.state.stockInfo ? 
        <><Row>
            <Col>
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
            </Col>
        </Row>
        <Row className="stock-chart">
                <Col md="8" s="12">
                    <TradingViewWidget symbol={this.state.stockInfo.ticker} autosize />
                </Col>
                <Col md="4">
                    <Row className="pcard" >
                        <PurchaseCard user={this.props.location.state.user} stockInfo={this.state.stockInfo} buy={true} history={this.props.history}/>
                    </Row>
                    <Row className="pcard">
                        {this.state.hasStock.length > 0 ? 
                        <PurchaseCard user={this.props.location.state.user} stockInfo={this.state.stockInfo} buy={false} history={this.props.history}/> :
                        <PurchaseCard user={this.props.location.state.user} stockInfo={this.state.stockInfo} buy={false} lock={true}/>}
                    </Row>
                </Col>
        </Row>
        <Row className="info">
            <Col md="4" className="justify-content-center align-items-middle">
                    {this.state.hasStock.length > 0 ?
                    <EquityCard stock={this.state.hasStock[0]}/> : <EquityCard lock={true} /> 
                    }            
            </Col>
            <Col md="4">
                   <FinancialCard ticker={this.props.match.params.ticker}/> 
            </Col>
            <Col md="4">   
                    <CompanyInfoCard stockInfo={this.state.stockInfo}/>
            </Col>
        </Row></>
            : <></>
    }
        <Row className="news pad-top justify-content-center">
            <Card className="news-card border-0">
              <Card.Header as="h5">Current News</Card.Header>
                <Card.Body className="list-group">
                    {this.state.news[0] ? this.state.news.map((article) => (
                        <Article  
                            link={article.url}
                            title={article.title}
                            symbols={article.symbols}
                            summary={article.summary}
                            image={article.image}/>
                    )) : ""
                }
                </Card.Body>
            </Card> 
        </Row>
        </Container>
        );
    }

}

export default StockPage;