import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';

class CompanyInfoCard extends Component{


    render(){

        return(
            <Container>
                <Row>
        <span className="equity-title">About {this.props.stockInfo.ticker}</span> 
            </Row>
            <Row>
                {this.props.stockInfo.description}
            </Row>
            <Row>
            <Col>
                <Row className="semi-title">
                    CEO
                </Row>
                <Row>
                    {this.props.stockInfo.ceo}
                </Row>
              </Col>
              <Col>
                <Row className="semi-title">
                    List date:
                </Row>
                <Row>
                    {this.props.stockInfo.listdate}
                </Row>
              </Col>
            </Row>
            </Container>
        );

    }

}

export default CompanyInfoCard;