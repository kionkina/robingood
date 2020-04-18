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
        .send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});


/*
given an email and password, 
finds a User with the given email 
and verify that the given password is correct
If pass is correct, we issue a signed token to the requester
*/
router.post('/authenticate', function(req, res) {
    const { email, password } = req.body;
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
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            console.log("token:" + token);
            console.log("ADDING COOKIE TO RES!");
            res.cookie('token', token,  {httpOnly: false });

            res.sendStatus(200);
          }
        });
      }
    });
  });

  /*
router.get('/secret', withAuth, function(req, res) {
    res.send('The password is potato');
  });
  */

router.get('/checkToken', withAuth, function(req, res) {
  console.log("CHECKING TOKEN...");

    res.sendStatus(200);
});



module.exports = router;