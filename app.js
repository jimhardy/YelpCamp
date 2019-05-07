var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

// Mongoose Connect
mongoose.connect(process.env.MONGO, { useNewUrlParser: true }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('mongo connected');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
// serve public directory - makes this available when server runs
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
seedDB();

app.get('/', (req, res) => {
    res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
    // res.render('campgrounds', {campgrounds: campgrounds});
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

// CREATE - add new campground
app.post('/campgrounds', (req, res) => {
    console.log('you have reached the post route');
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // add to campgrounds collection
    var newCampground = { name: name, image: image, description: desc };
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Campground added');
            // console.log(campground);
            // redirect to GET
            res.redirect('/campgrounds');
        }
    });
});

// NEW - show form to add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - shows info for specific campground
app.get('/campgrounds/:id', (req, res) => {
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
// .
// ==================
// COMMENTS ROUTES
// ==================
app.get('/campgrounds/:id/comments/new', (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            throw err;
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('-----------------------------');
    console.log('YelpCamp Server Has Started');
    console.log('-----------------------------');
});
