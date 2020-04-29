const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    name: String,
    ticker: String,
    buyPrice: Number,
    quantity: Number,
    currentPrice: Number,
    todayReturn: Number,
    todayReturnPercentage: Number,
    totalReturn: Number,
    totalReturnPercentage: Number,
    marketCap: Number
})

module.exports = mongoose.model('Stock', stockSchema)