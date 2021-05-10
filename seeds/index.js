// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
//   }
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

// const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding')
// const mapboxToken= process.env.MAPBOX_TOKEN;
// const geocoder= mbxGeocoding({accessToken:mapboxToken});
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
    for(let i=0; i<300; i++){
        let random1000= Math.floor(Math.random()*1000);
        let city= citiesArr[random1000];
        
        let campName= randomName();
        const price= Math.floor(Math.random()*30)+10;

        // const geoData= await geocoder.forwardGeocode({
        //     query: `${city.city}, ${city.state}`,
        //     limit: 1
        // }).send()
        
        const camp= new campgroundModel({
            title:campName, 
            location:`${city.city}, ${city.state}`,
            // geometry: geoData.body.features[0].geometry,
            geometry:{
                type: "Point",
                coordinates: [city.longitude,city.latitude]
            },
            description: 'This beautiful campground is set in a very serene location overlooking the hills. It has something for everyone to explore and has all the necessary facilities. You can also rest assured that it won\'t burn a hole in your pocket! If you are looking for a beautiful weekend getaway and a break from the fast paced city life, this is the place for you! Pay a visit and make memories worth a lifetime!',
            price: price,
            author: "608ec3a7632b4c9b43b39ae7",
            images:[
                {
                    url: "https://res.cloudinary.com/nupur/image/upload/v1620645251/YelpCamp/yelpcamp4_r6v4pw.jpg",
                    filename: "YelpCamp/yelpcamp4_r6v4pw"
                },
                {
                    url: "https://res.cloudinary.com/nupur/image/upload/v1620208262/YelpCamp/yelpcamp6_w7pqrk.jpg",
                    filename: "YelpCamp/yelpcamp6_w7pqrk"
                },
                {
                    url: "https://res.cloudinary.com/nupur/image/upload/v1620208196/YelpCamp/yelpcamp9_wanw4j.jpg",
                    filename: "YelpCamp/yelpcamp9_wanw4j"
                }
            ]
        });
        
        await camp.save();
        
    }
}

seedDB()
    .then(()=>{
        mongoose.connection.close();
    });