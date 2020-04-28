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



module.exports = router;