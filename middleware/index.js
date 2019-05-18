const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

// MIDDLEWARE
// checks that user is logged in and 'owns' campground
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	// checks that user is logged in and 'owns' campground
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err || !foundCampground) { // added !foundCampground to handle null value returned
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// does user own the campground?
				if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

// checks that user is logged in and 'owns' comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// does user own the comment?
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

// prevent user from adding comment if not logged in isAuth
middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that"); // access flash on next request
	res.redirect("/login");
};

module.exports = middlewareObj;
