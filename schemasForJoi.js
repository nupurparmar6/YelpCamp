const Joi= require('joi');

let campgroundSchema= Joi.object({
    // campgrounds: Joi.object().required()
    
    campgrounds: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports= campgroundSchema;
// const Joi = require('joi');

// module.exports.campgroundSchema = Joi.object({
//     campgrounds: Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().required(),
//         location: Joi.string().required(),
//         description: Joi.string().required()
//     }).required()
// });