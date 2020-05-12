import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';

class Article extends Component{


    render(){
        return(
            <Row className="news-row">
                <Col md="9">
                <Row className="new-title">
                    <a href={this.props.link} className="new-link"> {this.props.title} </a>
                </Row>
                <Row className="new-sub">
                    {this.props.symbols}
                </Row>
                <Row className="news-summ">
                    <div>
                        {this.props.summary}
                    </div>
                </Row>
                </Col>
                <Col md="3" className="align-self-center justify-contents-center">
                    <Container>
                        <img src={this.props.image} className="my-auto news-image"/>
                    </Container>
                </Col>
            </Row>
        );
    }


}

export default Article;