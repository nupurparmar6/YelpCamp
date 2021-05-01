
const campgroundModel= require('../models/campground.js');
const reviewModel= require('../models/review.js');

module.exports.create= async(req,res,next)=>{
    const camp= await campgroundModel.findById(req.params.id);
    const newReview= new reviewModel(req.body.reviews);
    newReview.author= req.user._id;
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash('success', "Review added successfully");
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.delete= async(req,res)=>{
    const {id, reviewId}= req.params;
    await campgroundModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviewModel.findByIdAndDelete(reviewId);
    req.flash('success', "Review Deleted");
    res.redirect(`/campgrounds/${id}`);
}