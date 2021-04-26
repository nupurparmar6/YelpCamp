const mongoose= require('mongoose');
const reviewModel= require('./review.js');

//schema
const campgroundSchema= mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});

//middleware to delete all reviews once a campground is gone
campgroundSchema.post('findOneAndDelete', async function(doc){
    //doc is the deleted campground
    console.log(doc);
    console.dir(doc);
    if(doc){
        console.log("im working");
       await reviewModel.deleteMany({ 
           _id:{
               $in: doc.reviews
            } 
        })
    }
})

const campgroundModel= mongoose.model('Campground', campgroundSchema);
module.exports= campgroundModel;