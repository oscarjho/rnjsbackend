const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req,res) => {
  const errors = {};
  //Check email
  User
    .findOne({email: req.body.email})
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);      
      } else {
        const newUser = new User ({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        //Bcrypt password
        bcrypt.hash(newUser.password, 10, function(err, hash) {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      }
    })
  }
); 

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => { 
  const errors = {};
  const email = req.body.email;
  const password = req.body.password;
  //Find User by email
  User.findOne({email}).then( user => {
    //If the user dosnt exist
    if (!user) {
      errors.email='User not found';
      return res.status(404).json({errors});
    } else {
      //If the user exists lets check the password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch){
          errors.password='Incorrect password';
          return res.status(400).json({errors});
        } else {
          //If the user matched lets create the jwt for access
          const payload = { id: user.id, name: user.name, email: user.email }; // Create JWT Payload
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        }
      })
    }
  })
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;

