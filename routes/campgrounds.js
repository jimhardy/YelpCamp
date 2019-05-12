const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require('../middleware'); // automatically requires index if requiring dir

// INDEX - show all campgrounds
router.get("/", (req, res) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", { campgrounds: allCampgrounds });
		}
	});
});

// CREATE - add new campground
router.post("/", middleware.isLoggedIn, (req, res) => {
	// get data from form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	// add to campgrounds collection
	var newCampground = {
		name: name,
		image: image,
		description: desc,
		author: author
	};
	Campground.create(newCampground, (err, campground) => {
		if (err) {
			req.flash('error' , 'Something went wrong - please try again');
		} else {
			req.flash('success' , 'Campground added!')
			// console.log(campground);
			// redirect to GET
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to add new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// SHOW - shows info for specific campground
router.get("/:id", (req, res) => {
	// find campground with provided ID
	Campground.findById(req.params.id)
		.populate("comments")
		.exec((err, foundCampground) => {
			if (err || !foundCampground) { // added !foundCampground to prevent null being passed
				req.flash('error' , 'Campground not found');
				res.redirect('back');
			} else {
				// console.log(foundCampground)
				res.render("campgrounds/show", { campground: foundCampground });
			}
		});
	// render show template with that campground ID
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", { campground: foundCampground });
	});
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, err => {
		if (err) {
			req.flash('error' , 'Something went wrong - please try again');
			res.redirect("/campgrounds");
		} else {
			req.flash('success' , 'Campground updated!')
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({ _id: { $in: campgroundRemoved } }, err => {
				if (err) {
					console.log("error");
				} else {
					// console.log("comments deleted");
					req.flash('success' , 'Campground deleted!');
					res.redirect("/campgrounds");
				}
			});
		}
	});
});

module.exports = router;
