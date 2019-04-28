const mongoose = require('mongoose');
 const Comment = require('./comment');

// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
});

module.exports = mongoose.model('Campground', campgroundSchema);