const mongoose= require('mongoose');

//schema
const reviewSchema= new mongoose.Schema({
    body: String,
    rating: Number,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const reviewModel= mongoose.model('Review', reviewSchema);
module.exports= reviewModel;