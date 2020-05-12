const express = require('express');
const router = express.Router();

const Stock = require('../models/stock');
const User = require('../models/User.js');

// Gets user object with given userId.
router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId).exec()
        .then(user => {
            // If the document with the given id exists
            if (user) {
                res.status(200).json(user);
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