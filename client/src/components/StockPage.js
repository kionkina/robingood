import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import EquityCard from './EquityCard';
import FinancialCard from './FinancialCard';
import PurchaseCard from './PurchaseCard';
import CompanyInfoCard from './CompanyInfoCard'

class StockPage extends Component{





    render(){
        return(
        <Container>
        <Row className="stockp-row">
            <Col md="8" >
                <Row className="stock-title">
                 <Col> 
                    Apple - APPL
                </Col>  
                </Row>
                <Row className="chart-price semi-title">
                <Col>
                    $4.12
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
                    <PurchaseCard buy={true}/>
                </Row>
                <Row className="pcard">
                    <PurchaseCard buy={false}/> 
                </Row>
                <Row className="pcard">
                    <CompanyInfoCard />
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
        </Container>
        );
    }

}

export default StockPage;