const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");



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

//Gets last trade price for symbol
router.get('/stock/:ticker', (req, res, next) => {
    const ticker = req.params.ticker;
    axios.get('https://api.polygon.io/v1/last/stocks/' + ticker, {
        params: {
            apiKey: process.env.API_KEY,
        }
    })
        .then(response => {
            console.log(response.data);

            res.status(200).json({ 'lastPrice': response.data.last.price });
            return response.data.last.price;
        }
        )
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
    fetchData();
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


module.exports = router;