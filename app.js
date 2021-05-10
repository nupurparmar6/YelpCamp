if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express= require('express');
const path= require('path');
const mongoose= require('mongoose');
const ejsMate= require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError= require('./utilities/ExpressError');
const methodOverride= require('method-override');
const passport= require('passport');
const localStrategy= require('passport-local');
const userModel = require('./models/user.js');
const expressMongoSanitize= require('express-mongo-sanitize');
const helmet = require('helmet');

//routes
const campgroundRoutes= require('./routes/campgrounds.js');
const reviewRoutes= require('./routes/reviews.js');
const userRoutes= require('./routes/users.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

//error handling in case db connection using mongoose gives an error
mongoose.connection.on('error', console.error.bind(console, "Connection error:"));
mongoose.connection.once("open", ()=>{
    console.log("Database connected");
});

const app = express();

//middleware
app.engine('ejs', ejsMate); //switches the engine for ejs to ejsMate from ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //views directory for our template is set

app.use(express.urlencoded({extended: true})); //required to parse req.body
app.use(methodOverride('_method')); //to send other kinds of requests than post/get from forms

app.use(express.static(path.join(__dirname, 'public'))); //serving public assets from public directory
app.use(expressMongoSanitize());

//session stuff
const sessionConfig={
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        name: 'session', //connect.sid won't be the name anymore
        httpOnly: true,
        // secure: true, //can only be accessed through secure requests now
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: 1000*60*60*24*7
    }

}
app.use(session(sessionConfig)); //always place this above passport.session()
app.use(flash()); //flash

//using helmet to add additional security to our headers
app.use(helmet());//enables all 11 middlweares that helmet comes with

//all the sources which we are verifying and adding to our content security policy using helmet
const scriptSrcUrls = [
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://use.fontawesome.com/releases/v5.15.1/js/all.js", //moi
    "https://code.jquery.com/jquery-3.5.1.slim.min.js", //moi
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://code.jquery.com/jquery-3.5.1.slim.min.js", //moi
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css", //moi
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/nupur/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//flash middleware
app.use((req,res,next)=>{
    if(!(req.originalUrl=='/login'||req.originalUrl=='/'||req.originalUrl=='/register')){
        req.session.returnToUrl= req.originalUrl;
    }
    res.locals.currentUser= req.user;
    res.locals.success= req.flash('success'); //res.locals.SUCCESS is they key here
    res.locals.error= req.flash('error'); //error is the key here
    next();
})

//Router middleware
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes) 
app.use('/', userRoutes);

/********************************* Home Route *************************************************************************************************************************/
app.get('/', (req,res)=>{
    res.render('home');
})

/***** Error handling middleware **********************************************************************************************/
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




