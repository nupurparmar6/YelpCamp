const express= require('express');
const router= express.Router();

const wrapAsync= require('../utilities/wrapAsync');
const {isLoggedIn,isAuthor,validateCampground}= require('../middlewares.js');
// const isAuthor= require('../middlewares.js');
// const validateCampground= require('../middlewares.js');
const campgrounds= require('../controllers/campgrounds.js');

/****** Adding Campgrounds CRUD functionality **********************************************************************************************/

/**** CREATE **********************************************************************************************/

//serves form for creating new camps
//NOTE: this route needs to be above the '/campgrounds/:id' route or it will treat 'new' as an id and try to find stuff
router.route('/')
    .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.create))
    .get(wrapAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, validateCampground, wrapAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;