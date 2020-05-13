const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');

const signToken = userID =>{
    return JWT.sign({
        iss : "NoobCoder",
        sub : userID
    },"NoobCoder",{expiresIn : "1h"});
}

userRouter.post('/register',(req,res)=>{
    const { email, password } = req.body;
    User.findOne({email},(err,user)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        if(user)
            res.status(400).json({message : {msgBody : "Username is already taken", msgError: true}});
        else{
            const newUser = new User({email,password, buyingPower: 300000,  portfolioValue: 300000,  portfolioPerformance: 0},
               );
            
            newUser.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
            });
        }
    });
});

userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
    console.log("LOGIN");
    if(req.isAuthenticated()){
      console.log("authenticated");
       const {_id,email} = req.user;
       const token = signToken(_id);
       res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
       
       User.findById(_id).exec()
        .then(user => {
            // If the document with the given id exists
            if (user) {
                user.token = token;
                user.save();
                res.status(200).json({isAuthenticated : true,user : user});
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
    }
    else{
      console.log("not authenticated");
    }
});

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
    res.clearCookie('access_token');
    res.json({user:{email : ""},success : true});
});


userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    console.log(req);
    const {email} = req.user;
    res.status(200).json({isAuthenticated : true, user : {email}});
});

/*
// THIS IS ALWAYS RETURNING 401
userRouter.get('/authenticatedd', (req,res) =>{
    const rawCookie = req.headers.cookie;
    if (!rawCookie){
        res.status(401);
    }
    else {
    console.log("cookie:");
    console.log(rawCookie);
    var rawCookieParams = rawCookie.split("=");
    var token = rawCookieParams[1];
    User.findOne({token: token}, (err,user)=>{
        if(user){
            console.log("FOUND USER FROM TOKEN");
            res.status(200).json({isAuthenticated : true,user : user});
        }
          // something went wrong with database
          else{
            res.status(401);
          }
         });

        res.status(401);
        }    
    });*/




module.exports = userRouter;