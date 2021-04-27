const express= require('express');
const router= express.Router();

const wrapAsync= require('../utilities/wrapAsync');
const {campgroundSchema}= require('../schemasForJoi.js');
const ExpressError= require('../utilities/ExpressError');
const campgroundModel= require('../models/campground.js');

const validateCampground= (req,res,next)=>{
    
    //joi gives the property of error
    // console.log(req.body);
    const result= campgroundSchema.validate(req.body);
    console.log(result.error);
    console.dir(result.error);
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
router.get('/new', (req,res)=>{
    res.render('campgrounds/new');
});


//posts this form info
router.post('/', validateCampground, wrapAsync(async(req,res,next)=>{
    
    // if(!req.body.campgrounds) throw new ExpressError("Invalid Campground Data", 404); //USING JOI FOR THIS NOW
    const newCamp= new campgroundModel(req.body.campgrounds);
    await newCamp.save();
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
    res.render('campgrounds/show',{camp});
    // res.send("chal toh raha hai");
}));

/**** UPDATE **********************************************************************************************/

//serves form
router.get('/:id/edit', wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    res.render('campgrounds/edit', {camp});
}));

router.put('/:id', validateCampground, wrapAsync(async(req,res,next)=>{

    const id= req.params.id;

    //update in db
    const updatedCamp= await campgroundModel.findOneAndUpdate(id,{...req.body.campgrounds}, {new:true});

    //shows details page
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

/**** DELETE **********************************************************************************************/

router.delete('/:id', wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
/***** End of Campgrounds CRUD **********************************************************************************************/

module.exports = router;