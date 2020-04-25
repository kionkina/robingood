const express = require ('express');
const router = express.Router();
const Todo = require('../models/todo');
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
// Import our User schema
const User = require('../models/User.js');
const withAuth = require('./middleware');

// Gets all users
router.get('/', (req, res, next) => {
  User.find()
  .exec()
  .then(docs => {
      console.log(docs);
      // if (docs.length >= 0) {
          res.status(200).json(docs);
      // }
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

// POST route to register a user
router.post('/register', function(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function(err) {
    if (err) {
      res.status(500)
        .json({message: {msgError: true, msgBody: "Error registering new user please try again."}});
    } else {
      res.status(200).json({message: {msgError: false, msgBody:"Successfully registered!"}});
    }
  });
});


/*
given an email and password, 
finds a User with the given email 
and verify that the given password is correct
If pass is correct, we issue a signed token to the requester
*/
router.post('/login', function(req, res) {
    const {email, password} = req.body
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          message: {msgError: true, msgBody: 'Internal error please try again'}
        });
      } else if (!user) {
        res.status(401)
          .json({
            message: {msgError: true, msgBody: 'Incorrect email or password'}
          });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                message: {msgError: true, msgBody: 'Internal error please try again'}
            });
          } else if (!same) {
            res.status(401)
              .json({
                message: {msgError: true, msgBody: 'Incorrect email or password'}
            });
          } else {
            // issue a signed token to the requester
            // const payload = { email };
            // const token = jwt.sign(payload, secret, {
            //   expiresIn: '1h'
            // });
            // console.log("token:" + token);
            // console.log("ADDING COOKIE TO RES!");
            // res.cookie('token', token,  {httpOnly: false });

            res.status(200)
            .json({
              isAuthenticated: true,
              user: user,
              message: {msgError: false, msgBody: "Success"}
            });
          }
        });
      }
    });
  });


  router.post('/logout', function(req, res) {
    res.status(200)
    .json({});
  })

  /*
router.get('/secret', withAuth, function(req, res) {
    res.send('The password is potato');
  });
  */

// router.get('/checkToken', withAuth, function(req, res) {
//   console.log("CHECKING TOKEN...");

//     res.sendStatus(200);
// });



module.exports = router;