const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

// MIDDLEWARE
// checks that user is logged in and 'owns' campground
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    // checks that user is logged in and 'owns' campground
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
                res.redirect("back");
			} else {
                // does user own the campground?
				if (foundCampground.author.id.equals(req.user._id)) {
                    next();
				} else {
                    res.redirect("back");
				}
			}
		});
	} else {
        res.redirect("back");
	}
};

// checks that user is logged in and 'owns' comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
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
};


  // prevent user from adding comment if not logged in isAuth
  middlewareObj.isLoggedIn = (req , res , next) => {
    if(req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login');
  }
  

module.exports = middlewareObj;
