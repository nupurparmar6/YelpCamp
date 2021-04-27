const express= require('express');
const router= express.Router({mergeParams:true});

const wrapAsync= require('../utilities/wrapAsync');
const {reviewSchema}= require('../schemasForJoi.js');
const ExpressError= require('../utilities/ExpressError');
const reviewModel= require('../models/review.js');
const campgroundModel= require('../models/campground.js');

const validateReview= (req,res,next)=>{
    
    //joi gives the property of error
    console.log(req.body);
    const result= reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
        //details is an array thus we are extracting message from all and joining using ','
        const message= result.error.details.map((element)=>element.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
}

/***** Reviews CRUD START **********************************************************************************************/

/**** CREATE **********************************************************************************************/
router.post('/', validateReview, wrapAsync(async(req,res,next)=>{
    const camp= await campgroundModel.findById(req.params.id);
    const newReview= new reviewModel(req.body.reviews);
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}));

/**** DELETE **********************************************************************************************/
router.delete('/:reviewId', wrapAsync(async(req,res)=>{
    const {id, reviewId}= req.params;
    await campgroundModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports= router;