import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class HotStockCard extends Component{
    render(){
        let profitStatus = "stock-container-r";
        let dataProfit = "stock-data-r"
        if(this.props.profit){
            profitStatus = "stock-container-g";
            dataProfit = "stock-data-g";
        }
        return (
         <div className="container-wrapper">
            <Container className={profitStatus}>
            <div className="wrapper">
            <Row className="stock-row">
                <Col xs="auto">
                <div className="stock-heading">Name</div>
                <div className="stock-name"> {this.props.name}</div>
                </Col>
                <Col xs="auto">
                <div className="stock-heading">Price</div>
                <div className="stock-data"> {this.props.price} </div>
                </Col>
                <Col xs="auto">
                <div className="stock-heading">Market Cap</div>
                <div className="stock-data"> {this.props.marketCap} </div>
                </Col>
            </Row>
            <Row className="stock-row">
                <Col md="auto" xs="auto">
                <div className="stock-heading">Ticker</div>
                <div className="stock-name"> {this.props.tick} </div>
                </Col>
                {/* <Col xs="auto">
                <div className="stock-heading">Today's Return</div>
                <div className={dataProfit}> {this.props.dailyReturn}</div>
                </Col>
                <Col xs="auto">
                <div className="stock-heading">Total Return</div>
                <div className={dataProfit}> {this.props.totalReturn} </div>
                </Col> */}
            </Row>
            </div>
        </Container>
       </div>
        );
    }
}

export default HotStockCard;