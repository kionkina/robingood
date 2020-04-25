const express = require ('express');
const router = express.Router();
const Todo = require('../models/todo');
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
// Import our User schema
const User = require('../models/User.js');
const withAuth = require('./middleware');

// POST route to register a user
router.post('/register', function(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function(err) {
    if (err) {
      res.status(500)
        .json({message: "Error registering new user please try again."});
    } else {
      res.status(200).json({message: "Successfully registered!"});
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
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect email or password'
          });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
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
              message: "logged in!"
            });
          }
        });
      }
    });
  });


  router.post('/logout', function(req, res) {
    res.status(200)
    .json({
      isAuthenticated: true,
    });
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