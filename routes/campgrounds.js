const express= require('express');
const router= express.Router();

const wrapAsync= require('../utilities/wrapAsync');
const campgroundModel= require('../models/campground.js');
const {isLoggedIn,isAuthor,validateCampground}= require('../middlewares.js');
// const isAuthor= require('../middlewares.js');
// const validateCampground= require('../middlewares.js');

/****** Adding Campgrounds CRUD functionality **********************************************************************************************/

/**** CREATE **********************************************************************************************/

//serves form for creating new camps
//NOTE: this route needs to be above the '/campgrounds/:id' route or it will treat 'new' as an id and try to find stuff
router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/new');
});


//posts this form info //is
router.post('/', isLoggedIn, validateCampground, wrapAsync(async(req,res,next)=>{
    
    // if(!req.body.campgrounds) throw new ExpressError("Invalid Campground Data", 404); //USING JOI FOR THIS NOW
    const newCamp= new campgroundModel(req.body.campgrounds);
    // console.log(newCamp);
    newCamp.author= req.user._id;
    // console.log(newCamp);
    await newCamp.save();
    req.flash('success', "Successfully created campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
}));


/**** READ **********************************************************************************************/
// Index ie show all
router.get('/', wrapAsync(async(req,res,next)=>{
    let campsArr= await campgroundModel.find({});
    res.render('campgrounds/index', {campsArr});
}));

//Details
router.get('/:id', wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    // console.log(camp);
    // camp.populate('reviews');
    //in case id is invalid, we are flashing an error
    if(!camp){
        req.flash('error', "Cannot find campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
}));

/**** UPDATE **********************************************************************************************/

//serves form
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    //in case id is invalid, we are flashing an error
    if(!camp){
        req.flash('error', "Cannot find campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(async(req,res,next)=>{

    const id= req.params.id;

    //update in db
    const updatedCamp= await campgroundModel.findOneAndUpdate(id,{...req.body.campgrounds}, {new:true});
    req.flash('success', "Successfully updated campground!");
    //shows details page
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

/**** DELETE **********************************************************************************************/

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    req.flash('success', "Campground Deleted");
    res.redirect('/campgrounds');
}));
/***** End of Campgrounds CRUD **********************************************************************************************/

module.exports = router;