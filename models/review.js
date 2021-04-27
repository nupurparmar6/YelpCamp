const mongoose= require('mongoose');

//schema
const reviewSchema= new mongoose.Schema({
    body: String,
    rating: Number
});

const reviewModel= mongoose.model('Review', reviewSchema);
module.exports= reviewModel;