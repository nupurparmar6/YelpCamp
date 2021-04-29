const mongoose= require('mongoose');
const passportLocalMongoose= require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})

//this will add password and username fields as well as validations to our userSchema
userSchema.plugin(passportLocalMongoose);

const userModel= new mongoose.model('User', userSchema);
module.exports= userModel;