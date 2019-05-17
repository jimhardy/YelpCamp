const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');
// seedDB = require('./seeds');

// Requiring Routes
const commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(
    require('express-session')({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public')); // serve public directory - makes this available when server runs
app.use(flash());
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // whatever we put in res.locals is what is available inside of our template
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds/', campgroundRoutes);
app.use(indexRoutes);

// ==================
// MONGOOSE CONNECT
// ==================
mongoose.connect(process.env.MONGO, { useNewUrlParser: true }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('db connected');
    }
});
mongoose.set('useFindAndModify', false);
// seedDB();

// ==================
// SERVER
// ==================
app.listen(process.env.PORT, process.env.IP, () => {
    console.log('-----------------------------');
    console.log('YelpCamp Server Has Started');
    console.log('-----------------------------');
});
