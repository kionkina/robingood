import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'

class PurchaseCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            shares: 0,
            total: 0.00,
            price: 4.12
    };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
    handleChange(event) {
        this.setState({shares: event.target.value,total: event.target.value * this.state.price});
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }

    render(){
        return(
            <Container>
            <Row className="title-row">
                <span> {this.props.buy ? 'Buy' : 'Sell'} AAPL</span>
            </Row>
            <Row className="pad"> 
                <Col md="6" className="ptitle">
                    Shares
                </Col>
                <Col md="6">
                <input type="number" value={this.state.value} onChange={this.handleChange}name="shares" placeholder="0"/>
                </Col>
            </Row>
            <Row className="pad">
                <Col md="6" className="ptitle">
                    Market Price
                </Col>
                <Col md="6">
                    $4.12       
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
                    {this.props.buy ? 'Buying Power: $14,394.34' : 'Shares Owned: 8'}
                </Col>
                <Col>
                <input type="submit" class="btn btn-outline-success" value="Submit" />
                </Col>
            </Row>

            </Container>
        );
    }


}

export default PurchaseCard;