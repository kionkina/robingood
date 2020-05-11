const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const path = require('path');
const fetch = require('fetch');

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
            console.log(response.data)
            var tickerArray = [];
            response.data.tickers.map(stock => {
                var dict = { 'ticker': stock.ticker, 'name': stock.name }
                tickerArray.push(dict);
                //console.log(stock);
            });
            console.log(tickerArray);

            res.status(200).json({ tickerArray });
            return tickerArray;
        }
        )
        .catch(err => {
            console.log(err);
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
        dict['description'] = result.data.description;
        dict['country'] = result.data.country;
        dict['listdate'] = result.data.listdate;
        dict['industry'] = result.data.industry;

        //console.log(marketCap);
        
        //dict['marketCap'] = marketCap;
        res.status(200).json(dict);
        return dict;
     }
        )
        .catch(err => {
            //console.log(err);
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

        var price = result.data.last.price;
        var name = result.data.name;
        var dict = {};
        dict["ticker"] = ticker;
        dict["lastPrice"] = price;
        dict["name"] = 
        res.status(200).json(dict);
        return dict;
     }
        )
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// router.get('/stockcomplete/:ticker', (req, res, next) => {
//     axios.get('/stockInfo/stock/' + req.params.ticker)
//     .then(resb => {
//         axios.get('/stockInfo/metaData/' + req.params.ticker)
//         .then(resc => {
//             res.status(200).json({...resb.data, ...resc.data})
//         })
//         .catch(errb => {
//             //console.log("hi123", errb)
//             res.sendStatus(500)
//             //console.log(errb)
//         })
//     })
//     .catch(errc => {
//         //console.log(req.params.ticker)
//         console.log(errc)
//         res.sendStatus(500)
//         //console.log(errc)
//     })
// });

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
    axios.get('https://www.etrade.wallst.com/Research/Markets/Movers')
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                let topMovers = [];
                //console.log($);
                $('.col-2').each(function (i, elem) {
                    topMovers.push($($(elem).children()[1]).text());
                });
                topMovers = topMovers.slice(1);
                //console.log(topMovers);

                res.status(200).json({
                    hotStocks: topMovers
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});


const fetchData = async () => {
    axios.get('https://www.etrade.wallst.com/Research/Markets/Movers')
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                let topMovers = [];
                //console.log($);
                $('.col-2').each(function (i, elem) {
                    topMovers.push($($(elem).children()[1]).text());
                });
                topMovers = topMovers.slice(1);
                console.log(topMovers);

                return topMovers;
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};

//returns total equity of user at time point
router.get('/equity/:userId', (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    //var url = path.join(__dirname, '/stocks/'+userId);
    axios.get('http://localhost:5000/userStocks/'+userId).then(result => {
        var stocks = result.data;
        var tickerQuantities = {};
        var tickerPrices = {};
        var equity = 0;
        stocks.map((item, i) =>{
            tickerQuantities[item.symbol] =  item.quantity;
        })
        
        let promises = [];
        var tickerSymbols = Object.keys(tickerQuantities);
        for (i = 0; i < tickerSymbols.length; i++) {
        promises.push(
            axios.get('http://localhost:5000/stockInfo/stockPrice/' + tickerSymbols[i]).then(response => {
		    var ticker = response.data["ticker"];
		    var price = response.data["lastPrice"];
		    tickerPrices[ticker] = price; //pushing current price
    })
  );
    }
    console.log(tickerQuantities);
    Promise.all(promises).then(() => {
        tickerSymbols.map( (ticker) => 
        {   
            console.log(tickerQuantities[ticker] + " shares of " + ticker + "* " + tickerPrices[ticker]);
            var adding = tickerQuantities[ticker] * tickerPrices[ticker];
            console.log(" = " + adding);
            equity += adding;
            console.log("equity = " + equity);
             })

            
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
                console.log(result.data);
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
            console.log(ret);
            return res.status(200).json(ret);
            }) // end Promise.all(promises).then

    .catch(err => 
        console.log(err)
    );
});
    
    




module.exports = router;