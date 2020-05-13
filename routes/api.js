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
            const newUser = new User({email,password});
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
       res.status(200).json({isAuthenticated : true,user : {email}});
    }
    else{
      console.log("not authenticated");
    }
});

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
    res.clearCookie('access_token');
    res.json({user:{email : ""},success : true});
});

userRouter.post('/todo',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const todo = new Todo(req.body);
    todo.save(err=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            req.user.todos.push(todo);
            req.user.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created todo", msgError : false}});
            });
        }
    })
});


userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {email} = req.user;
    res.status(200).json({isAuthenticated : true, user : {email}});
});


module.exports = userRouter;