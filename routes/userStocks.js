const express = require('express');
const axios = require("axios");
const router = express.Router();

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

// Update total returns for a given user + update portfolio
// Get current price for a (given stock - initial price) / initial
// Return all updated stocks
// Gets all stocks for the user with given userId.
router.get('/update/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId).exec()
        .then(user => {
            // If the document with the given id exists
            if (user) {
                // Get stocks
                const stocks = user.stocks;
                var portfolioValue = 0;

                // For each stock, grab updated price and calculate total returns + update on mongodb
                stocks.forEach((item, index) => {
                    portfolioValue += item.currentPrice * item.quantity
                    axios.get('https://api.polygon.io/v1/last/stocks/' + item.ticker, {
                        params: {
                            apiKey: process.env.API_KEY,
                        }
                    })
                        .then(result => {
                            var buyPrice = stocks[index].buyPrice;
                            var currentPrice = result.data.last.price;
                            var totalReturn = (currentPrice - buyPrice).toFixed(2);
                            var totalReturnPercentage = (totalReturn / buyPrice).toFixed(2);
                            stocks[index].totalReturn = totalReturn;
                            stocks[index].totalReturnPercentage = totalReturnPercentage;

                            updateStock(userId, stocks[index].id, totalReturn, totalReturnPercentage)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                });

                const filter = { _id: userId };
                const update = { portfolioValue: portfolioValue };

                // Update portfolio value in the database.
                User.findOneAndUpdate(filter, update, { new: true, upsert: true });

                var response = {};
                response['userId'] = userId;
                response['portfolioValue'] = portfolioValue;
                response['stocks'] = stocks;
                res.status(200).json(response);
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
    const stock = new Stock({
        name: req.body.name,
        ticker: req.body.ticker,
        buyPrice: req.body.buyPrice,
        quantity: req.body.quantity,
        currentPrice: req.body.buyPrice,
        marketCap: req.body.marketCap,
        totalReturn: 0,
        totalReturnPercentage: 0,
    })
    const userId = req.params.userId;


    User.findById(userId).exec()
        .then(user => {
            console.log('From database', user);
            // If the document with the given id exists
            if (user) {
                var cost = stock.buyPrice * stock.quantity;
                var newBuyingPower = user.buyingPower - cost;
                var newPortfolioValue = user.portfolioValue + cost;
                
                const filter = { _id: userId };
                const update = { buyingPower: newBuyingPower, portfolioValue: newPortfolioValue };

                // Update portfolioValue.
                User.findOneAndUpdate(filter, update, { new: true, upsert: true });

                user.stocks.push(stock)
                user.save()
                    .then(result => {
                        console.log(result)
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

    // Add all changes requested for in updateOps.
    // This is so that you can just pass in whichever properties that are
    // actually getting updated.
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }

    User.update({ _id: userId, 'stocks._id': stockId }, { $set: { 'stocks.$.quantity': req.body.quantity } })
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
});

// Delete the stock with given stockId for the user with given userId.
router.delete('/:userId/:stockId', (req, res, next) => {
    const stockId = req.params.stockId;
    const userId = req.params.userId;

    User.findById(userId).exec()
        .then(user => {
            // If the document with the given id exists
            if (user) {
                var result = user.stocks.find(obj => {
                    return obj._id == stockId;
                });
                var gain = result.currentPrice * result.quantity;
                var newBuyingPower = user.buyingPower + gain;
                var newPortfolioValue = user.portfolioValue - gain;

                const filter = { _id: userId };
                const update = { buyingPower: newBuyingPower, portfolioValue: newPortfolioValue};

                // Update buyingPower.
                User.findOneAndUpdate(filter, update, { new: true, upsert: true });

                // Remove stock from database.
                User.update({ _id: userId }, { $pull: { stocks: { _id: stockId } } })
                    .exec()
                    .then(result => {
                        res.status(200).json(result);
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                console.log(result);
            } else {
                return null;
            }
        })
        .catch(err => {
            console.log(err);
            return null;
        });
});

module.exports = router;