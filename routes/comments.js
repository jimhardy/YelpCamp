const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ==================
// COMMENTS ROUTES
// ==================
router.get('/new', isLoggedIn , (req, res) => { // added isLoggedIn middleware
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        throw err;
      } else {
        res.render('comments/new', { campground: campground });
      }
    });
  });
  
  router.post('/', isLoggedIn , (req, res) => { // added isLoggedIn middleware
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
        res.redirect('campground');
      } else {
        // create new comment
        Comment.create(req.body.comment, (err, comment) => {
          if (err) {
            throw err;
          } else {
            // connect new comment to campground comment array
            campground.comments.push(comment);
            campground.save();
            // redirect to show page
            res.redirect('/campgrounds/' + campground._id);
          }
        });
      }
    });
  });
  
   // MIDDLEWARE
  // prevent user from adding comment if not logged in isAuth
  
  function isLoggedIn(req , res , next){
    if(req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login');
  }

  module.exports = router;