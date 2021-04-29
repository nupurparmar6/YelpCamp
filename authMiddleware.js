const passport= require('passport');

const isLoggedIn= (req, res, next)=>{
    if(!req.isAuthenticated()){
        // req.session.returnToUrl= req.originalUrl; //this will result in an infinite loop if login is clicked twice as returnToUrl will be set to /login then
        req.flash('error', "You need to login first");
        return res.redirect('/login');
    }
    next();
}

module.exports= isLoggedIn;