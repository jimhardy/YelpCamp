const mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

let data = [{
        name: 'Boswell Farms Happy Camp',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg',
        description: 'blah blah blah'
    },
    {
        name: 'Boswell Farms Happy Camp',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg',
        description: 'blah blah blah'
    },
    {
        name: 'Boswell Farms Happy Camp',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg',
        description: 'blah blah blah'
    }
]

const seedDB = () => {
    // remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('removed campgrounds');
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('added campground');
                        // create a comment
                        Comment.create({
                            text: 'This place is rad',
                            author: 'Jimmy'
                        }, (err, comment) => {
                            // console.log(comment);
                            if (err) {
                                console.log(err)
                            }
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log('created new comment');
                            }
                        });
                    }
                });

            });
        }
    });
};

module.exports = seedDB;
