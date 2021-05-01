
const campgroundModel= require('../models/campground.js');

module.exports.index= async(req,res,next)=>{
    let campsArr= await campgroundModel.find({});
    res.render('campgrounds/index', {campsArr});
}

module.exports.renderNewForm= (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.create= async(req,res,next)=>{
    
    // if(!req.body.campgrounds) throw new ExpressError("Invalid Campground Data", 404); //USING JOI FOR THIS NOW
    const newCamp= new campgroundModel(req.body.campgrounds);
    // console.log(newCamp);
    newCamp.author= req.user._id;
    console.log("new camp:" ,newCamp);
    await newCamp.save();
    req.flash('success', "Successfully created campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.show= async(req,res)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');

    console.log("show:" ,camp);

    //in case id is invalid, we are flashing an error
    if(!camp){
        req.flash('error', "Cannot find campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
}

module.exports.renderEditForm= async(req,res)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    console.log("found this camp to edit: ", camp);
    //in case id is invalid, we are flashing an error
    if(!camp){
        req.flash('error', "Cannot find campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}

module.exports.edit= async(req,res)=>{

    const id= req.params.id;

    //update in db
    const updatedCamp= await campgroundModel.findByIdAndUpdate(id,{...req.body.campgrounds});
    console.log(id, " updated:" ,updatedCamp);
    req.flash('success', "Successfully updated campground!");
    //shows details page
    console.log(`updated camp id: ${updatedCamp._id}, original camp id: ${id}`);
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.delete= async(req,res)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    req.flash('success', "Campground Deleted");
    res.redirect('/campgrounds');
}