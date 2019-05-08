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
    let newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , (err, user) => {
      if (err) {
        console.log(err);
        return res.render('register');
      }
      passport.authenticate('local')(req , res , () => {
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
    res.redirect('/');
  })
  
  // MIDDLEWARE
  // prevent user from adding comment if not logged in isAuth
  
  function isLoggedIn(req , res , next){
    if(req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login');
  }

  
  module.exports = router;