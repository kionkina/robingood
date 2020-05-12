const express = require('express');
const axios = require("axios");
const router = express.Router();
const async = require('async');
const Stock = require('../models/stock');
const User = require('../models/User.js');

// Gets all stocks for the user with given userId.
router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId).exec()
        .then(user => {
            console.log('From database', user);

            // If the document with the given id exists
            if (user) {
                console.log(user.stocks)
                res.status(200).json(user.stocks);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided userId'
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

router.put('/update/:userId', (req, res, next) => {
    let userId = req.params.userId;
    User.findById(userId).exec()
        .then(user => {
            // If the document with the given id exists
            if (user) {
                // Get stocks
                let stocks = user.stocks;
                let portfolioValue = 0;
                let promises = []
                //modify stocks array with updated currentprice, totalreturn + totalreturnpercentage
                stocks.forEach((stock, index) => {
                    promises.push(
                    axios.get('https://api.polygon.io/v1/last/stocks/' + stock.ticker, {
                        params: {
                            apiKey: process.env.API_KEY,
                        }
                    })
                        .then(resb => {
                            let buyPrice = stocks[index].buyPrice;
                            let currentPrice = resb.data.last.price;
                            let totalReturn = ((currentPrice - buyPrice) * stock.quantity).toFixed(2);
                            let totalReturnPercentage = (totalReturn / (buyPrice * stock.quantity) * 100).toFixed(2);

                            stocks[index].totalReturn = totalReturn;
                            stocks[index].totalReturnPercentage = totalReturnPercentage;
                            stocks[index].currentPrice = currentPrice;
                            portfolioValue += resb.data.last.price * stock.quantity
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        })
                    )
                    });
                    //then update each stock in database
                    Promise.all(promises).then(() => {
                        async.eachSeries(stocks, function updateStocks(stock, done) {
                            User.update({ _id: userId, 'stocks._id': stock._id }, { $set: { 'stocks.$.totalReturn': stock.totalReturn, 'stocks.$.totalReturnPercentage': stock.totalReturnPercentage, 'stocks.$.currentPrice': stock.currentPrice}}, done);
                        }, function allDone (err) {
                            const filter = { _id: userId };
                            const update = { portfolioValue: portfolioValue };
                            
                            // Update portfolio value in the database.
                            User.findOneAndUpdate(filter, update, { new: true, upsert: true }).then(resc =>{
                                let response = {};
                            
                                response['userId'] = userId;
                                response['portfolioValue'] = portfolioValue;
                                response['stocks'] = stocks;
                                res.status(200).json(response);
                            })
                        });
                    });

            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided userId'
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

// Update the given userStock with the given total returns.
function updateStock(userId, stockId, totalReturn, totalReturnPercentage) {
    User.update({ _id: userId, 'stocks._id': stockId }, { $set: { 'stocks.$.totalReturn': totalReturn, 'stocks.$.totalReturnPercentage': totalReturnPercentage } });
}


// Post a stock data when the user initially buys.
router.post('/:userId', (req, res, next) => {
    console.log("posting the stock")
    let stock = req.body.stock
    const id = req.params.userId;
    console.log(id)
    User.findById(id).exec()
        .then(user => {
            console.log('From database', user);
            // If the document with the given id exists
            if (user) {
                let cost = stock.buyPrice * stock.quantity;
                let newBuyingPower = user.buyingPower - cost;
                
                const filter = { _id: id };
                const update = { buyingPower: newBuyingPower };

                // Update portfolioValue.
                User.findOneAndUpdate(filter, update, { new: true, upsert: true });

                user.stocks.push(stock)
                user.save()
                    .then(result => {
                        console.log(result)
                        User.update({ _id: id }, {$inc: {'buyingPower': req.body.total}})
                        .exec()
                        .then(result => {
                            res.status(200).json(result);
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                        res.status(200).json({
                            message: 'Handling POST request to /stocks',
                            createdStock: stock,
                            user: user
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
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
        });
        
});

// Get the stock with the given stockId for the user with given userId.
router.get('/:userId/:stockId', (req, res, next) => {
    const userId = req.params.userId;
    const stockId = req.params.stockId;

    User.findById(userId).exec()
        .then(user => {
            console.log('From database', user);
            // If the document with the given id exists
            if (user) {
                var result = user.stocks.find(obj => {
                    return obj._id == stockId;
                });
                console.log(result);
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided userId'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Update the stock with given stockId for the user with given userId.
// Only updates quantity for now.
router.patch('/:userId/:stockId', (req, res, next) => {
    const userId = req.params.userId
    const stockId = req.params.stockId;

        User.findById(userId).exec()
        .then(user => {
            let oldStock = user.stocks.filter(stock => stock.id === stockId)[0]
            console.log(oldStock)

            let temptotal = -req.body.total
            let oldtotal = oldStock.buyPrice * oldStock.quantity
            oldtotal += temptotal
            let totalquantity = Number(oldStock.quantity) + Number(req.body.quantity)
            let newcost = (oldtotal / totalquantity).toFixed(2)

            //we shouldnt modify avg cost if we're selling 
            if(req.body.total > 0){
                newcost = oldStock.buyPrice
            }
            
            User.update({ _id: userId, 'stocks._id': stockId }, { $inc: { 'stocks.$.quantity': req.body.quantity, 'buyingPower': req.body.total }, $set: {'stocks.$.buyPrice': newcost} })
            .exec()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Delete the stock with given stockId for the user with given userId.
router.delete('/:userId/:stockId', (req, res, next) => {
    const stockId = req.params.stockId;
    const userId = req.params.userId;
    console.log(req.body.total)
    User.update({ _id: userId }, { $pull: { stocks: { _id: stockId } }, $inc: {"buyingPower": req.body.total}})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return null;
        });
});


router.get('/portfolioHistory/:userId', (req, res, next) => {
    const userId = req.params.userId;
    console.log("here, about to call axios");
    console.log("updated");
    axios.get("http://localhost:5000/stockInfo/equity/"+userId)
        .then((result) => {
            console.log("this is the result:");
            console.log(result.data);
            const timeStamp = Date.now();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });
    
    //updatePortfolioHistory('5e9a55c652f6c0ac6745a9f9');
    

// Post a stock data when the user initially buys.
router.post('/updatePortfolio/:userId', (req, res, next) => {
   /* const id = req.params.userId;
    console.log(id);
    console.log("here, about to call axios");
    console.log("updated");
    axios.get("http://localhost:5000/stockInfo/equity/"+id)
        .then((result) => {
            console.log("this is the result:");
            console.log(result.data);
            const equity = result.data;
            const timeStamp = Date.now();
            const portfolioHistoryObj = {'timeStamp': timeStamp, 'equity': equity }
    console.log("id:");
    console.log(id);
    /*User.findById(id).exec()
    .then(user => {
        console.log('From database', user);
        // If the document with the given id exists
        if (user) {
   
            //do stuff
            
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
        }) */
    });
  
    


  
        


module.exports = router;