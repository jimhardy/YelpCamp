const express = require('express');
const router = express.Router(); 
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('landing');
  });
  
  // REGISTER
  router.get('/register', (req, res) => {
    res.render('register');
  });
  
  // SIGN UP LOGIC
  router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    if(req.body.adminKey === 'makemeadmin!'){
      newUser.isAdmin = true;
    }
    User.register(newUser , req.body.password , (err, user) => {
      if (err) {
        req.flash('error' , err.message);
        return res.render('register');
      }
      passport.authenticate('local')(req , res , () => {
        req.flash('success' , 'Welcome to YelpCamp, ' + user.username);
        res.redirect('/campgrounds');
      });
    });
  });
  
  // LOGIN 
  router.get('/login' , (req , res) => {
    res.render('login'); 
  });
  
  // handles login logic using passport.authenticate() middleware
  router.post('/login' , passport.authenticate('local' , {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }));
  
  // LOGOUT
  router.get('/logout' , (req , res) => {
    req.logout();
    req.flash('success' , 'Logged you out'); // access flash on next request
    res.redirect('/');
  })
  
  module.exports = router;