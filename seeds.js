const mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

let data = [{
        name: 'Boswell Farms Happy Camp',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt enim in lectus varius, finibus pharetra erat molestie. Mauris eros lacus, tristique eget mauris ac, dapibus vehicula lectus. Praesent placerat purus nulla, nec pellentesque metus gravida a. Proin tempor non enim nec lacinia. Fusce sed aliquet ipsum, quis congue quam. Cras tincidunt dolor vitae est scelerisque, in scelerisque metus pellentesque. Aliquam non dignissim nisl. Suspendisse neque quam, vehicula et elit quis, pretium fermentum metus. Curabitur laoreet, enim a scelerisque laoreet, lorem sem facilisis ante, at consequat ligula nulla nec diam.'
    },
    {
        name: 'Boswell Farms Happy Camp',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt enim in lectus varius, finibus pharetra erat molestie. Mauris eros lacus, tristique eget mauris ac, dapibus vehicula lectus. Praesent placerat purus nulla, nec pellentesque metus gravida a. Proin tempor non enim nec lacinia. Fusce sed aliquet ipsum, quis congue quam. Cras tincidunt dolor vitae est scelerisque, in scelerisque metus pellentesque. Aliquam non dignissim nisl. Suspendisse neque quam, vehicula et elit quis, pretium fermentum metus. Curabitur laoreet, enim a scelerisque laoreet, lorem sem facilisis ante, at consequat ligula nulla nec diam.'
    },
    {
        name: 'Boswell Farms Happy Camp',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt enim in lectus varius, finibus pharetra erat molestie. Mauris eros lacus, tristique eget mauris ac, dapibus vehicula lectus. Praesent placerat purus nulla, nec pellentesque metus gravida a. Proin tempor non enim nec lacinia. Fusce sed aliquet ipsum, quis congue quam. Cras tincidunt dolor vitae est scelerisque, in scelerisque metus pellentesque. Aliquam non dignissim nisl. Suspendisse neque quam, vehicula et elit quis, pretium fermentum metus. Curabitur laoreet, enim a scelerisque laoreet, lorem sem facilisis ante, at consequat ligula nulla nec diam.'
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
