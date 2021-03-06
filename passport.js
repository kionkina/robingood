const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User');

const cookieExtractor = req =>{
    let token = null;
    const rawCookie = req.headers.cookie;
    if(req && rawCookie){
        var rawCookieParams = rawCookie.split("=");
        token = rawCookieParams[1];
    }
    return token;
}

// authorization 
passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : "NoobCoder"
},(payload,done)=>{
    User.findOne({email : payload.email},(err,user)=>{
        if(err)
            return done(err,false);
        if(user)
            return done(null,user);
        else
            return done(null,false);
    });
}));

// authenticated local strategy using username and password
passport.use(new LocalStrategy({usernameField:"email", passwordField:"password"}, function(email,password,done) {
    User.findOne({email},(err,user)=>{
        // something went wrong with database
        if(err)
            return done(err);
        // if no user exist
        if(!user)
            return done(null,false);
        // check if password is correct
        user.comparePassword(password,done);
        
    });
}));