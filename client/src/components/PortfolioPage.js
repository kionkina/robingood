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
        }
    }
    componentDidMount(){
        axios.get('stockInfo/getPortfolioHistory/' + this.props.location.state.user._id).then(res =>{
            console.log("GETTING HISTORY");
            let tempArr = [];
            let tempDict = {}   
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
    }
    render(){
            console.log(this.state.timePoints)
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
                    Your Performance
                </Row>
                <Row>
                {console.log({options})}
                {this.state.timePoints[0] ? 
                <CanvasJSChart options={options} />: 
                "Loading Chart"}
                </Row>
            </Container>
        );
    }

}

export default PortfolioPage;