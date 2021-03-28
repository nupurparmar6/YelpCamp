
const express= require('express');
const path= require('path');
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




/********************************* ROUTES START *************************************************************************************************************************/

app.get('/', (req,res)=>{
    res.render('home');
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
});