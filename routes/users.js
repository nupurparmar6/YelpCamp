const express= require('express');
const router= express.Router({mergeParams:true});
const userModel= require('../models/user.js');
const wrapAsync= require('../utilities/wrapAsync');
const ExpressError= require('../utilities/ExpressError');
const passport= require('passport');

//register route
router.get('/register', (req, res)=>{
    res.render('users/register');
})

router.post('/register', wrapAsync(async (req, res, next)=>{
    try{
        const {username, email, password}= req.body;
        const newUser= new userModel({email,username});
        const registeredUser= await userModel.register(newUser,password);
        req.login(registeredUser, err=>{
            if(err) return next(err);//invokes our error handler
            req.flash('success', "You have successfully registered!");
            res.redirect('/campgrounds');
        })
        // req.flash('success', "You have successfully registered!");
        // res.redirect('/campgrounds');
    } catch(err){
        req.flash('error',err.message);
        res.redirect('/register');
    }

}));

//login route
router.get('/login', (req,res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), async (req, res)=>{
    const returnToUrl= req.session.returnToUrl||'/campgrounds';
    req.flash('success', "Welcome back!" );
    delete req.session.returnToUrl; //resetting the variable
    res.redirect(returnToUrl);
});

//logout
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', "Logged out" );
    res.redirect('/campgrounds');
  });


module.exports= router;