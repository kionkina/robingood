import React,{Component} from 'react';
import axios from 'axios';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class PurchaseCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            shares: 0,
            total: 0.00,
            stock: [],
    };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    componentDidMount(){
        console.log(this.props.user)
        let ticker = this.props.stockInfo.ticker
        let userstocks = this.props.user.stocks
        this.setState({
            stock: userstocks.filter(stock => ticker === stock.ticker)
        })
    }
    handleChange(event) {
        if(event.target.value < 1 && event.target.value != ""){
            event.target.value = 1
            this.setState({shares: 1, total: this.props.stockInfo.lastPrice});
        }

        let max;
        if(this.props.buy){
            max = Math.floor(this.props.user.buyingPower / this.props.stockInfo.lastPrice)
        }
        else{
            max = this.state.stock[0].quantity
        }
        if(event.target.value > max){
            event.target.value = max
            this.setState({shares: max, total: (max * this.props.stockInfo.lastPrice).toFixed(2)});
        }
        else{
            this.setState({shares: event.target.value, total: (event.target.value * this.props.stockInfo.lastPrice).toFixed(2)});
        }
    }
    
    handleSubmit(event) {
        console.log("hellos")
        event.preventDefault();
        if(this.props.buy){
            
            //use post request if user has no previous owned stock of this ticker
            if(this.state.stock.length === 0){
                const stock = {
                    name: this.props.stockInfo.name,
                    ticker: this.props.stockInfo.ticker,
                    buyPrice: this.props.stockInfo.lastPrice,
                    quantity: this.state.shares,
                    currentPrice: this.props.stockInfo.lastPrice,
                    marketCap: this.props.stockInfo.marketCap,
                    totalReturn: 0,
                    totalReturnPercentage: 0,
                }
                axios.post('/userStocks/' + this.props.user._id, {stock: stock, total: -this.state.total})
                .then(res => {
                  console.log(res);
                  console.log('donehaha')
                    this.props.history.push('/')
                })
                .catch(function (err) {
                  console.log(err);
                });
            }
            else{
                //otherwise increment quantity and decrement buying power
                axios.patch('/userStocks/' + this.props.user._id + '/' + this.state.stock[0]._id, {quantity: this.state.shares, total: -this.state.total})
                .then(res => {
                console.log(res);
                    this.props.history.push('/')
                })
                .catch(function (err) {
                console.log(err);
                });
            }

        }
        else{
            //use delete request if user wants to sell all of this stock
            if(this.state.shares == this.state.stock[0].quantity){
                let payload = {total: this.state.total}
                axios.delete('/userStocks/' + this.props.user._id + '/' + this.state.stock[0]._id, {data: payload})
                .then(res => {
                  console.log(res);
                    this.props.history.push('/')
                })
                .catch(function (err) {
                  console.log(err);
                });
            }
            else{
                //otherwise decrement quantity and increment buying power
                axios.patch('/userStocks/' + this.props.user._id + '/' + this.state.stock[0]._id, {quantity: -this.state.shares, total: this.state.total})
                .then(res => {
                console.log(res);
                    this.props.history.push('/')
                })
                .catch(function (err) {
                console.log(err);
                });
            }
        }

    }

    render(){
        return(
            <Container>
                {/* if buying and buying power > stockprice or if selling and the user has the any quantity of the stock, display the card */}
                {(this.props.buy && this.props.user.buyingPower > this.props.stockInfo.lastPrice) || (!this.props.buy && (this.state.stock.length > 0)) ?
                <div>
            <Row className="title-row">
                <span> {this.props.buy ? 'Buy' : 'Sell'} {this.props.stockInfo.ticker}</span>
            </Row>
            <Row className="pad"> 
                <Col md="6" className="ptitle">
                    Shares
                </Col>
                <Col md="6">
                <input type="number" min="1" step="1" value={this.state.value} onChange={this.handleChange}name="shares" placeholder="1"/>
                </Col>
            </Row>
            <Row className="pad">
                <Col md="6" className="ptitle">
                    Market Price
                </Col>
                <Col md="6">
                    ${this.props.stockInfo.lastPrice}       
                </Col>
            </Row>
            <Row className="pad">
                <Col md="6" className="ptitle">
                    Total Estimate
                </Col>
                <Col md="6">
                    <span>$</span>{this.state.total}
                </Col>
            </Row>
            <Row className="pad">
                <Col>
                {this.props.buy ? <>Buying Power: ${this.props.user.buyingPower.toFixed(2)}</> : <>Shares Owned: {this.state.stock[0].quantity}</>}
                </Col>
                <Col>
                <input type="submit" onClick={this.handleSubmit} class="btn btn-outline-success" value="Submit" />
                {/* <button class="btn"></button> */}
                </Col>
            </Row>
            </div>
            : <></>
            }
            </Container>
        );
    }


}

export default PurchaseCard;