const express= require('express');
const router= express.Router({mergeParams:true});
const userModel= require('../models/user.js');
const wrapAsync= require('../utilities/wrapAsync');
const ExpressError= require('../utilities/ExpressError');
const passport= require('passport');
const users= require('../controllers/users.js');

//register routes
router.route('/register')
.get(users.renderRegisterForm)
.post(wrapAsync(users.register));

//login routes
router.route('/login')
.get(users.renderLoginForm)
.post(passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), users.login);

//logout
router.get('/logout', users.logout);

module.exports= router;