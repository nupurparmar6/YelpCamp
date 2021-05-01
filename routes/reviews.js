const express= require('express');
const router= express.Router({mergeParams:true});

const wrapAsync= require('../utilities/wrapAsync');
const reviewModel= require('../models/review.js');
const campgroundModel= require('../models/campground.js');
const {isLoggedIn, validateReview, isReviewAuthor}= require('../middlewares.js');
const reviews= require('../controllers/reviews.js');

/***** Reviews CRUD START **********************************************************************************************/

/**** CREATE **********************************************************************************************/
router.post('/', validateReview, isLoggedIn, wrapAsync(reviews.create));

/**** DELETE **********************************************************************************************/
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.delete));

module.exports= router;