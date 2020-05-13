const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const path = require('path');
const fetch = require('fetch');
const User = require('../models/User.js');

//Gets list of tickers and stock names based on key
router.get('/search/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v2/reference/tickers', {
        params: {
            sort: 'ticker',
            search: ticker,
            apiKey: process.env.API_KEY,
            market: 'stocks'
        }
    })
        .then(response => {
           // console.log(response.data)
            var tickerArray = [];
            response.data.tickers.map(stock => {
                var dict = { 'ticker': stock.ticker, 'name': stock.name }
                tickerArray.push(dict);
                //console.log(stock);
            });
            //console.log(tickerArray);

            res.status(200).json({ tickerArray });
            return tickerArray;
        }
        )
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//returns marketCap
router.get('/metaData/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v1/meta/symbols/' + ticker + '/company', {
        params: {
            apiKey: process.env.API_KEY,
        }
    })
    .then(result => {
        dict = {};
        //console.log(result.data);
        dict['marketCap'] = result.data.marketcap;
        dict['name'] = result.data.name;
        dict['industry'] = result.data.industry;
        dict['ceo'] = result.data.ceo;
        dict['similar'] = result.data.similar;
        dict['tags'] = result.data.tags;

        //console.log(marketCap);
        
        //dict['marketCap'] = marketCap;
        res.status(200).json(dict);
        return dict;
     }
        )
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
//get performance of stock today
router.get('/stockPerf/:ticker', (req, res, next) =>{
    const tickerA = req.params.ticker;
    axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/'+ tickerA, {
            params: {
                apiKey: process.env.API_KEY,
            }
        })
        .then(result =>{
            //console.log(result);
            dict={};
            dict["dailyPercent"] = result.data.ticker.todaysChangePerc.toFixed(2);
            dict["priceChange"] = result.data.ticker.todaysChange.toFixed(2);
            res.status(200).json(dict);
            return dict;
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
//Gets last trade price for symbol 
router.get('/stock/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v1/last/stocks/' + ticker, {
        params: {
            apiKey: process.env.API_KEY,
        }
    })
    .then(result => {
        //console.log(result)
        var price = result.data.last.price;
        var dict = {};
        dict["ticker"] = ticker;
        dict["lastPrice"] = price;
        res.status(200).json(dict);
        return dict;
     })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Gets news articles for ticker
/*
[ { symbols: ,
     timestamp: ,
     title: ,
     url: ,
    source: ,
    summary: ,
    image: ,
     keywords:  }, {...}, {...}]
*/

router.get('/news/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v1/meta/symbols/' + ticker + '/news', {
        params: {
            apiKey: process.env.API_KEY,
        }
    })
        .then(response => {
            //console.log(res.data);
            res.status(200).json({ 'news': response.data })
            return response.data;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//returns list of top movers from 
//https://www.etrade.wallst.com/Research/Markets/Movers
router.get('/hotStocks', (req, res, next) => {
    fetchData().then((hotStocks) => {
        //console.log(hotStocks);
        return res.status(200).json(hotStocks);
        }
    );
})


const fetchData = async () => {
    const response = await axios.get('https://www.etrade.wallst.com/Research/Markets/Movers');
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                let topMovers = [];
                $('.col-2').each(function (i, elem) {
                    topMovers.push($($(elem).children()[1]).text());
                });
                topMovers = topMovers.slice(1);
                //console.log(topMovers);

                return topMovers;
            }
        else
            console.log(err);
            res.status(500).json({
                error: err
            })
        };

//returns total equity of user at time point
router.get('/equity/:userId', (req, res, next) => {
    const userId = req.params.userId;
    //var url = path.join(__dirname, '/stocks/'+userId);
    axios.get('http://localhost:5000/userStocks/'+userId).then(result => {
        //console.log(result);
        var stocks = result.data;
        var tickerQuantities = {};
        var tickerPrices = {};
        var equity = 0;
        stocks.map((item, i) =>{
            tickerQuantities[item.ticker] =  item.quantity;
        })
        
        let promises = [];
        var tickerSymbols = Object.keys(tickerQuantities);
       // console.log("ticker symbols:");
        //console.log(tickerSymbols);
        for (i = 0; i < tickerSymbols.length; i++) {
        promises.push(
            axios.get('http://localhost:5000/stockInfo/stock/' + tickerSymbols[i]).then(response => {
		    var ticker = response.data["ticker"];
		    var price = response.data["lastPrice"];
		    tickerPrices[ticker] = price; //pushing current price
    }).catch(err => 
        console.log(err)
    )
  );
    }
    
    Promise.all(promises).then(() => {
        //console.log("promises complete");
        tickerSymbols.map( (ticker) => 
        {   
            //console.log(tickerQuantities[ticker] + " shares of " + ticker + "* " + tickerPrices[ticker]);
            var adding = tickerQuantities[ticker] * tickerPrices[ticker];
            //console.log(" = " + adding);
            equity += adding;
            //console.log("equity = " + equity);
             })

            //console.log("EQUITY");
             return res.status(200).json(equity);
            }) // end Promise.all(promises).then
})
    .catch(err => 
        console.log(err)
    );
    
});


//returns total equity of user at time point
router.get('/stockCard/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    //var url = path.join(__dirname, '/stocks/'+userId);
        var ret = {};
        let promises = [];
        promises.push(
            //calls stock endpoint to get lastPrice and ticker
            axios.get('http://localhost:5000/stockInfo/stock/'+ticker).then(result => 
            { 
                Object.keys(result.data).map(key => {
                    ret[key] = result.data[key];
                })
            }
            ));

        promises.push(axios.get('http://localhost:5000/stockInfo/metaData/'+ticker).then(result => 
        {
            //collects metaData from /stockInfo/metaData/ticker
            Object.keys(result.data).map(key => {
                ret[key] = result.data[key];
            })
            
        }
        ));

        //combines responses
    Promise.all(promises).then(() => {
            //do stuff
           // console.log(ret);
            return res.status(200).json(ret);
            }) // end Promise.all(promises).then

    .catch(err => 
        console.log(err)
    );
});
    
router.get('/hotNews', (req, res, next) => {
    let promises = [];
    var news ={};
    let ret = [];
        //calls stock endpoint to get lastPrice and ticker
        axios.get('http://localhost:5000/stockInfo/hotStocks')
            .then(stocks => {
                stocks.data.map((item, i) =>{
                news[item] =  [];
            })
        })
    .then(() => {
        
        //console.log(news);
       //collects metaData from /stockInfo/metaData/ticker
       Object.keys(news).map(ticker => {
           promises.push(axios.get('http://localhost:5000/stockInfo/news/'+ticker).then(result => 
           {
               ret.push(result.data.news.slice(0,5));          
           }));
       })
    
   //combines responses
   Promise.all(promises).then(() => {
       return res.status(200).json(ret.flat());
       }) // end Promise.all(promises).then

.catch(err => 
   console.log(err)
)
})

});

    
//returns total equity of user at time point
router.get('/userNews/:userId', (req, res, next) => {
    
    const userId = req.params.userId;
    //var url = path.join(__dirname, '/stocks/'+userId);
  
        var news = [];
        let promises = [];
        var tickers =[];
            //calls stock endpoint to get lastPrice and ticker
            axios.get('http://localhost:5000/userStocks/'+userId)
            .then(result => {
                //if the user has no stocks, return hotlist news
                if (result.data.length == 0){
                    res.redirect("/stockInfo/hotNews")
                }
                //console.log(result);
                var stocks = result.data;
                stocks.map((item, i) =>{
                    tickers.push(item.ticker);
                })
            })
            .then(() => {
            //collects metaData from /stockInfo/metaData/ticker
                //print(tickers);
                tickers.map(ticker => {
                promises.push(axios.get('http://localhost:5000/stockInfo/news/'+ticker).then(result => 
                {

                    news.push(result.data.news.splice(0,5));               
                }));
            })
         
        //combines responses
        Promise.all(promises).then(() => {
            //console.log(news);
            return res.status(200).json(news.flat());
            }) // end Promise.all(promises).then

    .catch(err => 
        console.log(err)
    )})});
        

  // Update portfolio with equity at current timepoint
    router.get('/getPortfolioHistory/:userId', (req, res, next) => {
        const id = req.params.userId;
        User.findById(id).exec()
        .then(user => {
            console.log('From database', user);
            // If the document with the given id exists
            if (user) {
                //console.log(user.portfolioHistory);
                res.status(200).json(user.portfolioHistory);
            } 
            else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            }); 
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }) 
        });
 
    
    // Update portfolio with equity at current timepoint
    router.get('/updatePortfolioHistory/:userId', (req, res, next) => {
        const id = req.params.userId;
        axios.get("http://localhost:5000/stockInfo/equity/"+id)
            .then((result) => {
                const equity = result.data;
                var time = new Date();
                const timeStamp = time.toUTCString();
                const portfolioHistoryObj = {'timeStamp': timeStamp, 'totalEquity': equity }
        User.findById(id).exec()
        .then(user => {
            //console.log('From database', user);
            // If the document with the given id exists
            if (user) {
                user.updateOne( {$push:  { portfolioHistory: [portfolioHistoryObj]}},
                    function(err, result) {
                        if (err) {
                          res.send(err);
                        } else {
                          res.send(result);
                        }
                      }
                    );
                //console.log(user.portfolioHistory);
            } 
            else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            }); 
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }) 
        })
    });
    
    router.get('/updateAllPortfolios', (req, res, next) => {
        User.find({}, function(err, users) {
            var userMap = {};
        
            let promises = [];
            users.forEach(function(user) {
              userMap[user._id] = user;
              promises.push(

                axios.get("http://localhost:5000/stockInfo/updatePortfolioHistory/"+ user._id).then((result) =>{
                //console.log("updated portfolio for " + user);
              }).catch((err) => console.log(err))
             ); //end promises.push

            });

          //combines responses
   Promise.all(promises).then(() => {
    return res.status(200).json({"message":"update complete"});
    }) // end Promise.all(promises).then

    .catch(err => 
    console.log(err))
    })
});
        
    





module.exports = router;