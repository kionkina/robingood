import React from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import StockCard from './StockCard'

const Home = ()=>(
    <Container>
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
                            <div className="portfolio-val">$150,389.86 <svg class="bi bi-arrow-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
                            <div className="buying-pow">$15,342.34</div>
                            </Col>
                        </Row>
                        <Row className="balance-row">
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
                        </Row>
                    </div>
                </Container>
                </Row>
                <Row className="user-stocks-row justify-content-center">
                <Card className="user-stocks border-0">
                  <Card.Header as="h5">User Stocks</Card.Header>
                 <Card.Body className="list-group">
                    <StockCard name="Apple" 
                               profit={true} 
                               cost="274.45" 
                               marketCap="1.173 T" 
                               tick="APPL" 
                               dailyReturn="14.32 (1.2%)" 
                               totalReturn="34.67 (4.3%)"></StockCard>
                    <StockCard name="Tesla" 
                               profit={false} 
                               cost="573.71" 
                               marketCap="105.65 B" 
                               tick="TSLA" 
                               dailyReturn="-23.15 (-1.2%)" 
                               totalReturn="-32.45 (-4.3%)"></StockCard>
                    <StockCard name="Nvidia" 
                                profit={false} 
                                cost="243.54" 
                                marketCap="205.65 B" 
                                tick="NVDA" 
                                dailyReturn="-16.34 (-2.4%)" 
                                totalReturn="-42.45 (-5.3%)"></StockCard>
                 </Card.Body>
                </Card>
                </Row>
            </Col>
            <Col className="custom-col" sm>
                <Row className=" hot-stocks-row justify-content-center">
            <Card className="hot-stocks border-0">
                  <Card.Header as="h5" className="d-flex align-items-center"> <span className="header">Hot Stocks</span>  <input class="customForm form-control" type="text" placeholder="Search" aria-label="Search"></input></Card.Header>
                    <Card.Body className="list-group">
                            <StockCard name="Google" 
                                profit={true} 
                                cost="1214.78" 
                                marketCap="105.65 B" 
                                tick="GOOGL" 
                                dailyReturn="16.34 (2.4%)" 
                                totalReturn="42.45 (5.3%)"></StockCard>
                            <StockCard name="Netflix" 
                                profit={true} 
                                cost="123.24" 
                                marketCap="105.65 B" 
                                tick="NFLX" 
                                dailyReturn="16.34 (2.4%)" 
                                totalReturn="42.45 (5.3%)"></StockCard>
                            <StockCard name="Nvidia" 
                                profit={false} 
                                cost="243.54" 
                                marketCap="205.65 B" 
                                tick="NVDA" 
                                dailyReturn="-16.34 (-2.4%)" 
                                totalReturn="-42.45 (-5.3%)"></StockCard>
                            <StockCard name="Nvidia" 
                                profit={false} 
                                cost="243.54" 
                                marketCap="205.65 B" 
                                tick="NVDA" 
                                dailyReturn="-16.34 (-2.4%)" 
                                totalReturn="-42.45 (-5.3%)"></StockCard>
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
    </Container>
)

export default Home;