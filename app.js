const express= require('express');
const path= require('path');
const mongoose= require('mongoose');
const ejsMate= require('ejs-mate');
const campgroundSchema= require('./schemasForJoi.js');
const reviewSchema= require('./schemasForJoi.js');
const wrapAsync= require('./utilities/wrapAsync'); //note: remember to add next to all async fns
const ExpressError= require('./utilities/ExpressError');
const methodOverride= require('method-override');
const campgroundModel= require('./models/campground.js');
const reviewModel= require('./models/review.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//error handling in case db connection using mongoose gives an error
mongoose.connection.on('error', console.error.bind(console, "Connection error:"));
mongoose.connection.once("open", ()=>{
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate); //switches the engine for ejs to ejsMate from ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//middleware
//required to parse req.body
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//function we want to selectively call for middlewares but not for all so didnt use app.use //pass this fn as an argument
const validateCampground= (req,res,next)=>{
    
        //joi gives the property of error
        console.log(req.body);
        const result= campgroundSchema.validate(req.body);
        console.log(result);
        if(result.error){
            //details is an array thus we are extracting message from all and joining using ','
            const message= result.error.details.map((element)=>element.message).join(',');
            throw new ExpressError(message, 400)
        }else{
            next();
        }
}

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



/********************************* ROUTES START *************************************************************************************************************************/

app.get('/', (req,res)=>{
    res.render('home');
})

/****** Adding Campgrounds CRUD functionality **********************************************************************************************/

/**** CREATE **********************************************************************************************/

//serves form for creating new camps
//NOTE: this route needs to be above the '/campgrounds/:id' route or it will treat 'new' as an id and try to find stuff
app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
});


//posts this form info
app.post('/campgrounds', validateCampground, wrapAsync(async(req,res,next)=>{
    
    // if(!req.body.campgrounds) throw new ExpressError("Invalid Campground Data", 404); //USING JOI FOR THIS NOW
    const newCamp= new campgroundModel(req.body.campgrounds);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));


/**** READ **********************************************************************************************/
// Index ie show all
app.get('/campgrounds', wrapAsync(async(req,res,next)=>{
    let campsArr= await campgroundModel.find({});
    res.render('campgrounds/index', {campsArr});
}));

//Details
app.get('/campgrounds/:id', wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id).populate('reviews');
    // camp.populate('reviews');
    res.render('campgrounds/show',{camp});
    // res.send("chal toh raha hai");
}));

/**** UPDATE **********************************************************************************************/

//serves form
app.get('/campgrounds/:id/edit', wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    res.render('campgrounds/edit', {camp});
}));

app.put('/campgrounds/:id', validateCampground, wrapAsync(async(req,res,next)=>{

    const id= req.params.id;

    //update in db
    const updatedCamp= await campgroundModel.findOneAndUpdate(id,{...req.body.campgrounds}, {new:true});

    //shows details page
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

/**** DELETE **********************************************************************************************/

app.delete('/campgrounds/:id', wrapAsync(async(req,res,next)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
/***** End of Campgrounds CRUD **********************************************************************************************/
/***** Reviews CRUD START **********************************************************************************************/


/**** CREATE **********************************************************************************************/
app.post('/campgrounds/:id/reviews', validateReview, wrapAsync(async(req,res,next)=>{
    const camp= await campgroundModel.findById(req.params.id);
    const newReview= new reviewModel(req.body.reviews);
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}));

/**** DELETE **********************************************************************************************/
app.delete('/campgrounds/:campId/reviews/:reviewId', wrapAsync(async(req,res)=>{
    const {campId, reviewId}= req.params;
    await campgroundModel.findByIdAndUpdate(campId,{$pull:{reviews:reviewId}});
    await reviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campId}`);
}));




/***** Error handling middleware **********************************************************************************************/
//.all means get/post/put etc. anything would work
app.all('*',(req,res,next)=>{
    next(new ExpressError("Page Not Found(responding to error from all route)",404));
})
//this error handler will be hit whenever we throw an instance of ExpressError or any other error occurs on its own
app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', {err});
});





app.listen(3000, () => {
    console.log('Listening on port 3000!')
});