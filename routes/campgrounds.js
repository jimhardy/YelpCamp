const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware"); // automatically requires index if requiring dir

require("dotenv").config();

// IMAGE UPLOAD CONFIG
var multer = require("multer");
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function(req, file, res) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
		req.flash("error", "Only image files are allowed!");
		return res.redirect("back");
	}
	res(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require("cloudinary");
cloudinary.config({
	cloud_name: "dm5opqsyb",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX - show all campgrounds
router.get("/", (req, res) => {
	if (req.query.search) {
		// fuzzy search
		escapeRegex(req.query.search);
		const regex = new RegExp(escapeRegex(req.query.search), "gi");
		Campground.find({ name: regex }, (err, allCampgrounds) => {
			if (err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {
					campgrounds: allCampgrounds
				});
			}
		});
	} else {
		Campground.find({}, (err, allCampgrounds) => {
			if (err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {
					campgrounds: allCampgrounds
				});
			}
		});
	}
});

// CREATE - add new campground
router.post("/", middleware.isLoggedIn, upload.single("image"), (req, res) => {
	cloudinary.uploader.upload(req.file.path, result => {
		// add cloudinary url for the image to the campground object under image property
		req.body.campground.image = result.secure_url;
		// add author to campground
		req.body.campground.author = {
			id: req.user._id,
			username: req.user.username
		};
		Campground.create(req.body.campground, (err, campground) => {
			if (err) {
				req.flash("error", err.message);
				return res.redirect("back");
			}
			res.redirect("/campgrounds/" + campground.id);
		});
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
			if (err || !foundCampground) {
				// added !foundCampground to prevent null being passed
				req.flash("error", "Campground not found");
				res.redirect("back");
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
router.put(
	"/:id",
	middleware.checkCampgroundOwnership,
	upload.single("image"),
	(req, res) => {
		// // 
		// let imgURL = cloudinary.uploader.upload(req.file.path, result => {
		// 	// add cloudinary url for the image to the campground object under image property
		// 	return result.secure_url;
		// });
		// console.log(imgURL);
		// req.body.campground.image = imgURL;
		Campground.findByIdAndUpdate(
			req.params.id,
			req.body.campground,
			err => {
				if (err) {
					req.flash(
						"error",
						"Something went wrong - please try again"
					);
					res.redirect("/campgrounds");
				} else {
					req.flash("success", "Campground updated!");
					res.redirect("/campgrounds/" + req.params.id);
				}
			}
		);
	}
);

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
					// console.log('comments deleted');
					req.flash("success", "Campground deleted!");
					res.redirect("/campgrounds");
				}
			});
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
