
//file used to seed campground data. it will first delete existing campgrounds, then add random 50 to it

const mongoose= require('mongoose');
const { title } = require('process');
const campgroundModel= require('../models/campground.js'); //used ../ because models dir is in prev folder
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//error handling in case db connection using mongoose gives an error
mongoose.connection.on('error', console.error.bind(console, "Connection error:"));
mongoose.connection.once("open", ()=>{
    console.log("Database connected");
});

const citiesArr= require('./cities.js');
const {descriptors,places}= require('./seedHelpers.js');

/***************************************************************************************************/

function randomName(){

    let rand1= Math.floor(Math.random()*descriptors.length);
    let rand2= Math.floor(Math.random()*places.length);

    return `${descriptors[rand1]} ${places[rand2]}`;
}


async function seedDB(){

    //delete existing camps
    await campgroundModel.deleteMany({});

    //creating new camps and adding
    for(let i=0; i<50; i++){
        let random1000= Math.floor(Math.random()*1000);
        let city= citiesArr[random1000];
        
        let campName= randomName();
        const price= Math.floor(Math.random()*30)+10;
        
        const camp= new campgroundModel({
            title:campName, 
            image:'https://source.unsplash.com/collection/483251',
            location:`${city.city}, ${city.state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium quidem delectus veritatis minima inventore rem corrupti, dolores consequatur, facilis architecto possimus quia suscipit nesciunt magni. Adipisci nam unde perspiciatis non.',
            price: price
            
        });
        // const camp= {title:campName, location:`${city.city}, ${city.state}`};
        await camp.save();
        // console.log(camp);
    }
}

seedDB()
    .then(()=>{
        mongoose.connection.close();
    });