const mongoose= require('mongoose');
const validator= require('validator');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const crypto= require('crypto')


const userSchema= new mongoose.Schema({

     name:{
          type: String,
          required: [true, 'Please enter your name'],
          maxLenght: [30,'Your name can be more than 30 characters']
     },
     email:{
          type: String,
          required: [true, 'Please enter your email'],
          unique: true,
          validate: [validator.isEmail,'Please enter a valid email']
     },
     password:{
          type: String,
          required: [true, 'Please enter your password'],
          minLength: [6,'Your password must be at least 6 characters'],
          select: false
     },
     avatar:{
          public_id: {
           type:String,
          required: true
          },
          url: {
           type:String,
           required: true
          }
     },
     role:{
          type: String,
          default: 'user',
          enum: ['user', 'admin']
     },
     created_at: {
      type: Date,
      default: Date.now
     },
     resetPasswordToken: String,
     resetPasswordExpire: Date

})


//Encrypting the password before saving user

userSchema.pre('save', async function(next){

     const user= this;

     if(user.isModified('password')){
          user.password= await bcrypt.hash(user.password, 10);
     }

     next();
})


//Return JWT
userSchema.methods.getJwtToken =  function(){
            return jwt.sign({id: this._id},process.env.JWT_SECRET,{
                expiresIn: process.env.JWT_EXPIRES_TIME
            })
}


//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){

     return await bcrypt.compare(enteredPassword,this.password);   
}

//Generate password reset token

userSchema.methods.generatePasswordResetToken = function(){
     //Generate token
     const resetToken= crypto.randomBytes(20).toString('hex');

     //Hash and set to reset password token

     this.resetPasswordToken= crypto.createHash('sha256').update(resetToken).digest('hex');

     //Set token expire time
     this.resetPasswordExpire= Date.now() + 30 * 60 * 1000;

     return resetToken;
}

module.exports= mongoose.model('User',userSchema);