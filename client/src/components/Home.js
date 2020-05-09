import React,{Component} from 'react';
import axios from 'axios';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import StockCard from './StockCard'
import HotStockCard from './HotStockCard'
//todo: promise.all hot stock ticker for price and market cap, pass to hotstockcards

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
          user: this.props.user,
          userStocks: undefined,
          hotStocks: [],
          hotFiltered: [],
        }
      }
    componentDidMount(){
        console.log(this.state.user)
        axios.get('/userStocks/update/' + this.state.user._id)
        .then(res => {
          console.log(res);
          this.setState({
              userStocks: res.data
          })
        })
        .catch(function (err) {
          console.log(err);
        });

        axios.get('/stockinfo/hotStocks')
        .then(res => {
            console.log(res.data.hotStocks)
            let hotstocksb = []
            let promises = []
            let promisesb = []
            for(let i = 0; i < res.data.hotStocks.length; i++){
                promises.push(
                axios.get('/stockInfo/metaData/' + res.data.hotStocks[i]).then(resb => {
                    promisesb.push(
                    axios.get('/stockInfo/stock/' + res.data.hotStocks[i]).then(resc => {
                        console.log(i)
                        hotstocksb.push({...resb.data, ...resc.data})
                        
                        //console.log(hotstocks)
                    })
                    .catch(errc => {
                        //console.log(errc)
                    })
                    )

                    //hotstocksb.push(resb.data)
                })
                .catch(errb => {
                    //console.log(errb)
                })
                )
            }
            Promise.all(promises).then(() => {
                Promise.all(promisesb).then(() => {
                    console.log(hotstocksb)
                    this.setState({
                        hotStocks: hotstocksb,
                    })
                })
            });
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    handleClick = (ticker) => {
        this.props.history.push(`/stock/` + ticker)
    }
    handleChange = (e) => {
        let temp = this.state.hotStocks

        temp = temp.filter(stock => 
            stock.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            stock.ticker.toLowerCase().includes(e.target.value.toLowerCase())
        )
        console.log(temp)
        
        this.setState({
            hotFiltered: temp
        })

        e.preventDefault();
    }
    numberWithCommas = (x) => {
        x = x.toFixed(2)
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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
        return(

            <Container>
            {this.state.userStocks 
            ? 
            <div>
                <Row>
                    <Col className="custom-col" sm>
                        <Row className="balance-row">
                        <Container className="balance">
                            <div className="wrapper"> 
                                <Row className="balance-row">
                                    <Col>
                                    <div className="stock-heading"> Porfolio Value <svg class="bi bi-question-circle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clip-rule="evenodd"/>
        <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
        </svg></div>
                                    <div className="portfolio-val">{"$" + this.numberWithCommas(this.state.userStocks.portfolioValue + this.state.user.buyingPower)} <svg class="bi bi-arrow-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
        <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8 3.707 5.354 6.354a.5.5 0 11-.708-.708l3-3z" clip-rule="evenodd"/>
        </svg> <span className="percent"> 2.4%</span> </div>
                                    </Col>
                                </Row>

                                <Row className="balance-row">
                                    <Col>
                                    <div className="stock-heading"> Buying Power <svg class="bi bi-question-circle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clip-rule="evenodd"/>
        <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
        </svg></div>
                                    <div className="buying-pow">{"$" + this.numberWithCommas(this.state.user.buyingPower)
                                    }</div>
                                    </Col>
                                </Row>
                                {/* <Row className="balance-row">
                                    <Col>
                                    <div className="stock-heading"> Portfolio </div>
                                    <Container className="portfolio">
                                        <Row className="portfolio-graph justify-content-center">
                                            <Col  md="3" xs="3" className="companyA">
                                                Apple
                                            </Col>
                                            <Col md="7" xs="7" className="companyB">
                                                Google
                                            </Col>
                                            <Col md="2" xs="2" className="companyC">
                                                Tesla
                                            </Col>
                                        </Row>
                                    </Container>
                                    </Col>
                                </Row> */}

                            </div>
                        </Container>
                        </Row>
                        <Row className="user-stocks-row justify-content-center">
                        <Card className="user-stocks border-0">
                        <Card.Header as="h5">User Stocks</Card.Header>
                        <Card.Body className="list-group">
                            {this.state.userStocks.stocks[0] ? 
                            this.state.userStocks.stocks.map((eachStock) => (
                                <div onClick={() => this.handleClick(eachStock.ticker)}>
                                <StockCard name={eachStock.name}
                                profit={true} 
                                cost={eachStock.buyPrice}
                                quantity={eachStock.quantity}
                                //marketCap={this.marketCap(eachStock.marketCap)}
                                tick={eachStock.ticker}
                                dailyReturn="14.32 (1.2%)" 
                                totalReturn="34.67 (4.3%)"
                                >
                                </StockCard>
                                </div>
                            )) : ""
                            }
                        </Card.Body>
                        </Card>
                        </Row>
                    </Col>

                    <Col className="custom-col" sm>
                        <Row className=" hot-stocks-row justify-content-center">
                    <Card className="hot-stocks border-0">
                            <Card.Body className="list-group">

                            {this.state.hotStocks.length !== 0 ?
                            <div>
                            <Card.Header as="h5" className="d-flex align-items-center"> <span className="header">Hot Stocks</span>  <input class="customForm form-control" type="text" placeholder="Search" aria-label="Search" onChange={this.handleChange}></input></Card.Header>
                            </div>
                             : <></>}

                            {this.state.hotStocks.length !== 0 && this.state.hotFiltered.length === 0 ?
                            this.state.hotStocks.map((eachStock) => (
                                <HotStockCard name={eachStock.name} 
                                    profit={true} 
                                    price={eachStock.lastPrice}
                                    marketCap={this.marketCap(eachStock.marketCap)}
                                    tick={eachStock.ticker}></HotStockCard>
                                )) : ""
                            }                   
                            {this.state.hotStocks.length !== 0 && this.state.hotFiltered.length !== 0 ?
                            this.state.hotFiltered.map((eachStock) => (
                                <HotStockCard name={eachStock.name} 
                                    profit={true} 
                                    price={eachStock.lastPrice}
                                    marketCap={this.marketCap(eachStock.marketCap)}
                                    tick={eachStock.ticker}></HotStockCard>
                                )) : ""
                            }   
                            </Card.Body>
                        </Card>
                    </Row>
                </Col>        
                </Row>
                <Row className="news justify-content-center">
                <Card className="news-card border-0">
                    <Card.Header as="h5">Current News</Card.Header>
                        <Card.Body>
                            
                        </Card.Body>
                    </Card> 
                </Row>
            </div>
            : <></>
            }
            </Container>
        )
    }
}

export default Home;