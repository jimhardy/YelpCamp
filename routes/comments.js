const express = require('express');
const router = express.Router({mergeParams: true}); //allows us to access :id in the app.js file app.use for these routes
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// NEW COMMENT
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
  
  // CREATE COMMENT
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
            // add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save() // save comment
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
 
  // EDIT
  router.get('/:comment_id/edit' , checkCommentOwnership , (req , res) => {
    Comment.findById(req.params.comment_id , (err , foundComment) => {
        if(err) {
          res.redirect('back');
        } else {
          res.render('comments/edit' , {campground_id: req.params.id , comment: foundComment});
        }
    });
  });
  
// UPDATE
router.put('/:comment_id' , checkCommentOwnership , (req , res) => {
  Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , (err) => {
    if(err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
})

// DESTROY
router.delete('/:comment_id' , checkCommentOwnership , (req , res) => {
  Comment.findByIdAndRemove(req.params.comment_id , (err) => {
    if(err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
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
// checks that user is logged in and 'owns' campground
  function checkCommentOwnership(req , res , next) {
    if (req.isAuthenticated()){
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          res.redirect("back");
        } else {
          // does user own the comment?
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    } 
  }

  module.exports = router;