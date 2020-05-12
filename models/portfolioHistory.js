const mongoose = require('mongoose');

const portfolioHistorySchema = mongoose.Schema({
    timepoint: String,
    totalEquity: Number
})

module.exports = mongoose.model('portfolioHistory', portfolioHistorySchema)