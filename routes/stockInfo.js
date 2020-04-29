const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const path = require('path');
const fetch = require('fetch');



//Gets list of tickers and stock names based on key
router.get('/search/:key', (req, res, next) => {
    const key = req.params.key;
    axios.get('https://api.polygon.io/v2/reference/tickers', {
        params: {
          sort: 'ticker',
          search: key,
          apiKey: process.env.API_KEY,
          market: 'stocks'
        }
      })
    .then(res => {
        console.log(res.data)
        var tickerArray = [];
        res.data.tickers.map(stock => {
             var dict = {'ticker': stock.ticker, 'name': stock.name}
             tickerArray.push(dict);
             //console.log(stock);
        });
        console.log(tickerArray);
        return tickerArray;
    }
        )
    .catch(err => 
        console.log(err)
        );
});

//Gets last trade price for symbol
router.get('/stockPrice/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v1/last/stocks/'+ticker, {
        params: {
          apiKey: process.env.API_KEY,
        }
      })
    .then(result => {
        
        var price = result.data.last.price;
        var dict = {};
        dict[ticker] = price;
        return res.status(200).json(dict);
    }
        )
    .catch(err => 
        console.log(err)
        );
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
    axios.get('https://api.polygon.io/v1/meta/symbols/'+ticker+'/news', {
        params: {
          apiKey: process.env.API_KEY,
        }
      })
    .then(res => {
        //console.log(res.data);
        return res.data;
    }
        )
    .catch(err => 
        console.log(err)
        );
});


//returns list of top movers from 
//https://www.etrade.wallst.com/Research/Markets/Movers
router.get('/hotStocks', (req, res, next) => {
    fetchData();
});


    const fetchData = async () => {
    axios.get('https://www.etrade.wallst.com/Research/Markets/Movers')
   .then((response) => {
       if(response.status === 200) {
           const html = response.data;
           const $ = cheerio.load(html); 
           let topMovers = [];
           //console.log($);
           $('.col-2').each(function(i, elem) {
                topMovers.push($($(elem).children()[1]).text());
               });   
               topMovers = topMovers.slice(1);
               console.log(topMovers);
               return topMovers; 
            }
           
}, (error) => console.log(err) );

};

//returns total equity of user at time point
router.get('/equity/:userId', (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    //var url = path.join(__dirname, '/stocks/'+userId);
    axios.get('http://localhost:5000/stocks/'+userId).then(result => {
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
            var ticker = Object.keys(response.data)[0];
            var price = Object.values(response.data)[0];
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



module.exports = router;