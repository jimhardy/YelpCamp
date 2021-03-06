const express = require("express");
const router = express.Router({ mergeParams: true }); //allows us to access :id in the app.js file app.use for these routes
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware"); // automatically requires index if requiring dir

// NEW COMMENT
router.get("/new", middleware.isLoggedIn, (req, res) => {
	// added isLoggedIn middleware
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			throw err;
		} else {
			res.render("comments/new", { campground: campground });
		}
	});
});

// CREATE COMMENT
router.post("/", middleware.isLoggedIn, (req, res) => {
	// added isLoggedIn middleware
	// lookup campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			req.flash("error", "Something went wrong - please try again");
			res.redirect("campground");
		} else {
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					throw err;
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save(); // save comment
					// connect new comment to campground comment array
					campground.comments.push(comment);
					campground.save();
					// redirect to show page
					req.flash("success", "Successfully added comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT
router.get(
	"/:comment_id/edit",
	middleware.checkCommentOwnership,
	(req, res) => {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err || !foundCampground) {
				req.flash("error", "Cannot find campground");
				return res.redirect("back");
			}
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if (err || !foundComment) {
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					res.render("comments/edit", {
						campground_id: req.params.id,
						comment: foundComment
					});
				}
			});
		});
	}
);

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, err => {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, err => {
		if (err) {
			req.flash("error", "Something went wrong - please try again");
			res.redirect("back");
		} else {
			req.flash("error", "Comment deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
