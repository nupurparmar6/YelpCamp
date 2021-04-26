const mongoose= require('mongoose');

//schema
const reviewSchema= mongoose.Schema({
    body: String,
    rating: Number
});

const reviewModel= mongoose.model('Review', reviewSchema);
module.exports= reviewModel;