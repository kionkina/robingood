const mongoose = require('mongoose');

const portfolioHistorySchema = mongoose.Schema({
    timeStamp: String,
    totalEquity: Number
})

module.exports = mongoose.model('portfolioHistory', portfolioHistorySchema)