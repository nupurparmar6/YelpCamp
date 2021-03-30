const mongoose= require('mongoose');

//schema
const campgroundSchema= mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String
});

const campgroundModel= mongoose.model('Campground', campgroundSchema);
module.exports= campgroundModel;