const express= require('express');
const router= express.Router();

const wrapAsync= require('../utilities/wrapAsync');
const {campgroundSchema}= require('../schemasForJoi.js');
const ExpressError= require('../utilities/ExpressError');
const campgroundModel= require('../models/campground.js');
const isLoggedIn= require('../authMiddleware.js');

const validateCampground= (req,res,next)=>{
    
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
    const camp= await campgroundModel.findById(id).populate('reviews');
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
router.get('/:id/edit', isLoggedIn, wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    //in case id is invalid, we are flashing an error
    if(!camp){
        req.flash('error', "Cannot find campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}));

router.put('/:id', isLoggedIn, validateCampground, wrapAsync(async(req,res,next)=>{

    const id= req.params.id;

    //update in db
    const updatedCamp= await campgroundModel.findOneAndUpdate(id,{...req.body.campgrounds}, {new:true});
    req.flash('success', "Successfully updated campground!");
    //shows details page
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

/**** DELETE **********************************************************************************************/

router.delete('/:id', isLoggedIn, wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    req.flash('success', "Campground Deleted");
    res.redirect('/campgrounds');
}));
/***** End of Campgrounds CRUD **********************************************************************************************/

module.exports = router;