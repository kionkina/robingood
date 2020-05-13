// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Stock = require('./stock')
const portfolioHistory = require('./portfolioHistory');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stocks: { type: [Stock.schema] },
  portfolioHistory: { type:[portfolioHistory.schema] },
  buyingPower: { type: Number },
  portfolioValue: { type: Number },
  portfolioPerformance : { type: Number }
});

UserSchema.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
        }
    });
}


module.exports = mongoose.model('User', UserSchema);