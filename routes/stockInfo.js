const express = require('express');
const router = express.Router();
const axios = require("axios");

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
router.get('/stock/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v1/last/stocks/'+ticker, {
        params: {
          apiKey: process.env.API_KEY,
        }
      })
    .then(res => {
        console.log(res.data);
        return res.data.last.price;
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


module.exports = router;