import React,{Component} from 'react';
import '../App.css';
import {Container,Row,Col} from 'react-bootstrap';
import axios from 'axios';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PortfolioPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            timePoints: [],
            industryPoints: {},
            finalLabels: []
        }
    }
    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    componentDidMount(){
        axios.get('/stockInfo/getPortfolioHistory/' + this.props.location.state.user._id).then(res =>{
            console.log("GETTING HISTORY");
            let tempArr = [];
            let tempDict = {};   
            res.data.map((point) => (
                tempDict = {},
                tempDict['x'] = new Date(point.timeStamp),
                tempDict['y'] = point.totalEquity,
                tempArr.push(tempDict)
            ));
            this.setState({
                timePoints: tempArr,
            })
            console.log(this.state.timePoints);
        })
        .catch(err => {
            console.log(err)
            this.props.history.push(`/error/` + err.status)
        });
        let promises = [];
        let tempDict = {};
        for (var stock in this.props.location.state.stocks.stocks){
            console.log(this.props.location.state.stocks.stocks[stock]);
            promises.push(
            axios.get('/stockInfo/metaData/'+ this.props.location.state.stocks.stocks[stock].ticker).then(res => {
                if(tempDict[res.data.industry]){
                    tempDict[res.data.industry] = tempDict[res.data.industry] + 1;
                }
                else {
                    tempDict[res.data.industry] = 1;
                }

            })
            .catch(err => {
                console.log(err);
            }));
            
            //console.log(this.state.industryPoints)
        }
        Promise.all(promises).then(() => {
            console.log(Object.keys(tempDict));   
            let tempArr=[];
            for(var key of Object.keys(tempDict)) {
                let newDict={};    
                newDict ={};
                newDict['label'] = key;
                newDict['y'] = tempDict[key];
                tempArr.push(newDict);
            } 
            this.setState({
                finalLabels: tempArr,
            });
            console.log(this.state.finalLabels)
            })
       
    }
        // console.log("START OF KEYS");
        
        // console.log("END OF KEYS");
        // }
    render(){
            console.log(this.state.timePoints);
            const optionsB = {
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2", // "light1", "dark1", "dark2"
                title:{
                    text: "Portfolio Diversity"
                },
                data: [{
                    type: "pie",
                    indexLabel: "{label}: {y}",		
                    startAngle: -90,
                    dataPoints: this.state.finalLabels
                }]
            };
            const options = {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Performance Graph - Total Equity"
                },
                axisX:{
                    valueFormatString: " HH:mm DD MMM",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                axisY: {
                    title: "Equity Price",
                    includeZero: false,
                    valueFormatString: "$##0.00",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true,
                        labelFormatter: function(e) {
                            return "$" + CanvasJS.formatNumber(e.value, "##0.00");
                        }
                    }
                },
                data: [{
                    type: "area",
                    xValueFormatString: "HH:mm DD MMM",
                    yValueFormatString: "$##0.00",
                    dataPoints: this.state.timePoints
                }]
            } 

        return(
            <Container>
                <Row>
                {console.log({options})}
                {this.state.timePoints[0] ? 
                <CanvasJSChart options={options} />: 
                "Loading Chart"}
                </Row>
                <Row>
                <Col md="6">
                {this.state.finalLabels[0] ? 
                <CanvasJSChart options={optionsB} />: 
                "Loading Chart"}
                </Col>
                <Col md="6">
                </Col>
                </Row>
            </Container>
        );
    }

}

export default PortfolioPage;