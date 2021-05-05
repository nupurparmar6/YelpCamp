const mongoose= require('mongoose');
const reviewModel= require('./review.js');

const imageSchema= new mongoose.Schema({
    url: String,
    filename: String
});

//making a virtual on the image schema
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});

const campgroundSchema= new mongoose.Schema({
    title: String,
    price: Number,
    // image: String,
    images:[imageSchema],
    description: String,
    location: String,
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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