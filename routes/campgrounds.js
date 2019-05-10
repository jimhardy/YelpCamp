const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// INDEX - show all campgrounds
router.get('/', (req, res) => {
    // res.render('campgrounds', {campgrounds: campgrounds});
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/index', { campgrounds: allCampgrounds});
      }
    });
  });
  
  // CREATE - add new campground
  router.post('/', isLoggedIn , (req, res) => {
    console.log('you have reached the post route');
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    // add to campgrounds collection
    var newCampground = { name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(campground);
        // console.log(campground);
        // redirect to GET
        res.redirect('/campgrounds');
      }
    });
  });
  
  // NEW - show form to add new campground
  router.get('/new', isLoggedIn , (req, res) => {
    res.render('campgrounds/new');
  });
  
  // SHOW - shows info for specific campground
  router.get('/:id', (req, res) => {
    // find campground with provided ID
    Campground.findById(req.params.id)
      .populate('comments')
      .exec((err, foundCampground) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(foundCampground)
          res.render('campgrounds/show', { campground: foundCampground });
        }
      });
    // render show template with that campground ID
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