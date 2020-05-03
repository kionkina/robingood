const express = require('express');
const router = express.Router();

const Stock = require('../models/stock');
const User = require('../models/User.js');

// Gets all stocks for the user with given userId.
router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId).exec()
        .then(doc => {
            console.log('From database', doc);

            // If the document with the given id exists
            if (doc) {
                console.log(doc)
                res.status(200).json(doc);
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


// Gets the newest portfolio value.
router.get('/portfolioValue/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId).exec()
        .then(doc => {

            // If the document with the given id exists
            if (doc) {
                const stocks = doc.stocks;
                // For each stock, add to portfolio value by calculating current price * quantity.
                let portfolioValue = 0;
                stocks.forEach((item, index) => {
                    console.log(item)
                    portfolioValue += item.currentPrice * item.quantity
                });
                const filter = { _id: userId };
                const update = { portfolioValue: portfolioValue };
                
                // Update portfolio value in the database.
                User.findOneAndUpdate(filter, update, { new: true, upsert: true });

                var dict = {};
                dict['userId'] = userId;
                dict['portfolioValue'] = portfolioValue;

                res.status(200).json(dict);
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

module.exports = router;