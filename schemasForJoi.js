const Joi= require('joi');

module.exports.campgroundSchema= Joi.object({
    // campgrounds: Joi.object().required()
    
    campgrounds: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array() //not required 
});

module.exports.reviewSchema= Joi.object({
    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

