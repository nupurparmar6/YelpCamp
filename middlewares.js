const passport= require('passport');
const {campgroundSchema, reviewSchema}= require('./schemasForJoi.js');
const ExpressError= require('./utilities/ExpressError');
const campgroundModel= require('./models/campground.js');
const reviewModel= require('./models/review.js');

module.exports.validateCampground= (req,res,next)=>{
    
    //joi gives the property of error
    // console.log(req.body);
    const result= campgroundSchema.validate(req.body);
    // console.log(result.error);
    if(result.error){
        //details is an array thus we are extracting message from all and joining using ','
        const message= result.error.details.map((element)=>element.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
}

module.exports.validateReview= (req,res,next)=>{
    
    //joi gives the property of error
    // console.log(req.body);
    const result= reviewSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        //details is an array thus we are extracting message from all and joining using ','
        const message= result.error.details.map((element)=>element.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
}

module.exports.isAuthor= async (req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    if(!camp.author._id.equals(req.user._id)){
        req.flash('error', "You don't have permission for this");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor= async (req,res,next)=>{
    const reviewId= req.params.reviewId;
    const id= req.params.id;
    const review= await reviewModel.findById(reviewId);
   
    if(!review.author._id.equals(req.user._id)){
        req.flash('error', "You don't have permission for this");
        return res.redirect(`/campgrounds/${id}`);
    }

    next();
}

module.exports.isLoggedIn= (req, res, next)=>{
    if(!req.isAuthenticated()){
        // req.session.returnToUrl= req.originalUrl; //this will result in an infinite loop if login is clicked twice as returnToUrl will be set to /login then
        req.flash('error', "You need to login first");
        return res.redirect('/login');
    }
    next();
}
