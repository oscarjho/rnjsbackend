const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

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

module.exports = router;

