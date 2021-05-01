const userModel= require('../models/user.js');

module.exports.renderRegisterForm= (req, res)=>{
    res.render('users/register');
}

module.exports.register= async (req, res, next)=>{
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

}

module.exports.renderLoginForm= (req,res)=>{
    res.render('users/login');
}

module.exports.login= async (req, res)=>{
    const returnToUrl= req.session.returnToUrl||'/campgrounds';
    req.flash('success', "Welcome back!" );
    delete req.session.returnToUrl; //resetting the variable
    res.redirect(returnToUrl);
}

module.exports.logout= (req, res)=>{
    req.logout();
    req.flash('success', "Logged out" );
    res.redirect('/campgrounds');
  }