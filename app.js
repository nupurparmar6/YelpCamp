
const express= require('express');
const path= require('path');
const methodOverride= require('method-override');
const mongoose= require('mongoose');
const campgroundModel= require('./models/campground.js');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//error handling in case db connection using mongoose gives an error
mongoose.connection.on('error', console.error.bind(console, "Connection error:"));
mongoose.connection.once("open", ()=>{
    console.log("Database connected");
});

//middleware
//required to parse req.body
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


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
app.post('/campgrounds', async(req,res)=>{
    // res.send(req.body);
    const newCamp= new campgroundModel(req.body.campgrounds);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
});

/**** READ **********************************************************************************************/
// Index ie show all
app.get('/campgrounds', async(req,res) =>{
    let campsArr= await campgroundModel.find({});
    res.render('campgrounds/index', {campsArr});
});

//Details
app.get('/campgrounds/:id', async(req,res)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    res.render('campgrounds/show',{camp});
    // res.send("chal toh raha hai");
});

/**** UPDATE **********************************************************************************************/

//serves form
app.get('/campgrounds/:id/edit', async(req,res)=>{
    const id= req.params.id;
    const camp= await campgroundModel.findById(id);
    res.render('campgrounds/edit', {camp});
});

app.put('/campgrounds/:id', async(req,res)=>{

    const id= req.params.id;

    //update in db
    const updatedCamp= await campgroundModel.findOneAndUpdate(id,{...req.body.campgrounds}, {new:true});

    //shows details page
    res.redirect(`/campgrounds/${updatedCamp._id}`);
});

/**** DELETE **********************************************************************************************/

app.delete('/campgrounds/:id', async(req,res)=>{
    const id= req.params.id;
    await campgroundModel.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

/***** End of Campgrounds CRUD **********************************************************************************************/

app.listen(3000, () => {
    console.log('Listening on port 3000!')
});