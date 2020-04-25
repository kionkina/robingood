const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    symbol: String,
    buyPrice: Number,
    quantity: Number,
})

module.exports = mongoose.model('Stock', stockSchema)