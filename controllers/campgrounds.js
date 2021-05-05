
const campgroundModel= require('../models/campground.js');
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding')
const {cloudinary}= require('../cloudinary');
const mapboxToken= process.env.MAPBOX_TOKEN;
const geocoder= mbxGeocoding({accessToken: mapboxToken});
module.exports.index= async(req,res,next)=>{
    let campsArr= await campgroundModel.find({});
    res.render('campgrounds/index', {campsArr});
}

module.exports.renderNewForm= (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.create= async(req,res,next)=>{
    
    const geoData= await geocoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send()
    // console.log(req.body.campgrounds.location);
    // res.send(geoData.body.features[0].geometry);
    
    // if(!req.body.campgrounds) throw new ExpressError("Invalid Campground Data", 404); //USING JOI FOR THIS NOW
    const newCamp= new campgroundModel(req.body.campgrounds);
    newCamp.geometry= geoData.body.features[0].geometry;
    newCamp.images= req.files.map(file=> ({url: file.path, filename: file.filename}));
    // console.log(newCamp);
    newCamp.author= req.user._id;
    // console.log("new camp:" ,newCamp);
    await newCamp.save();
    console.log(newCamp);
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

    // console.log("show:" ,camp);

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
    // console.log("found this camp to edit: ", camp);
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
    const imgArr= req.files.map(file=> ({url: file.path, filename: file.filename}));
    updatedCamp.images.push(...imgArr);
    await updatedCamp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }

        await updatedCamp.updateOne( {$pull: { images: { filename: { $in: req.body.deleteImages} } } });
    }
    // console.log(id, " updated:" ,updatedCamp);
    req.flash('success', "Successfully updated campground!");
    //shows details page
    // console.log(`updated camp id: ${updatedCamp._id}, original camp id: ${id}`);
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.delete= async(req,res)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    req.flash('success', "Campground Deleted");
    res.redirect('/campgrounds');
}