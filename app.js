var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    Campground          = require('./models/campground'),
    seedDB              = require('./seeds');
    
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
seedDB();    

app.get('/' , (req , res) => {
res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', (req , res) => {
        // res.render('campgrounds', {campgrounds: campgrounds});
        Campground.find({} , (err , allCampgrounds) => {
            if(err){
                console.log(err)
            } else {
                res.render('campgrounds/index', {campgrounds: allCampgrounds});
            }
        })
});

// CREATE - add new campground
app.post('/campgrounds', (req , res) => {
    console.log('you have reached the post route');
        // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
        // add to campgrounds collection
    var newCampground = {name: name , image: image, description: desc}
    Campground.create(newCampground , (err , campground) => {
        if(err){
            console.log(err);
        } else {
            console.log('Campground added');
            console.log(campground);
            // redirect to GET
            res.redirect('/campgrounds');
        }
    });
});


// NEW - show form to add new campground
app.get('/campgrounds/new' , (req , res) => {
   res.render('campgrounds/new');
    
});

// SHOW - shows info for specific campground
app.get('/campgrounds/:id', (req , res) =>{
    // find campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec((err , foundCampground) => {
        if (err){
            console.log(err);
        } else {
            console.log(foundCampground)
                res.render('campgrounds/show' , {campground: foundCampground});
        }
    })
    // render show template with that campground ID

});

// ==================
// COMMENTS ROUTES
// ==================
app.get ('/campgrounds/:id/comments/new' , (req ,res) => {
   res.render('comments/new');
});





app.listen(process.env.PORT , process.env.IP, () => {
    console.log('-----------------------------');
    console.log('YelpCamp Server Has Started');
    console.log('-----------------------------');
});