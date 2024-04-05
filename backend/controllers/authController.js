const User= require('../models/user');
const ErrorHandler= require('../utils/errorHandler');
const catchAsyncErrors= require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtTokens');
const sendEmail = require('../utils/sendEmail');
const bcrypt= require('bcryptjs')

const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a user =>  /api/v1/register

exports.registerUser = catchAsyncErrors( async (req,res,next) => {

     const result= await cloudinary.v2.uploader.upload(req.body.avatar,{
          folder: 'avatars',
          width:150,
          crop: 'scale'
     })
     
     const {name,email,password} = req.body;

     const user= await User.create({
          name,
          email,
          password,
          avatar:{
               public_id: result.public_id,
               url: result.secure_url
          }
     });

      sendToken(user,200,res);
})


//Login User => /api/v1/login

exports.loginUser = catchAsyncErrors( async (req,res,next) => {

     const {email,password} = req.body;

     const user= await User.findOne({email}).select('+password');

     //check if email and password entered by user
    
     if(!email || !password){
          return next(new ErrorHandler('Please enter email and password',400))
     }

     if(!user){
          return next(new ErrorHandler('Invalid credentials',401))
     }

     //checks if password is correct or not

     const isPasswordMatched= await user.comparePassword(password);

     if(!isPasswordMatched){
          return next(new ErrorHandler('Incorrect Password',401))
     }
     sendToken(user,200,res);
     
})


//Forgot Password => /api/v1/password/forgot
exports.forgotPassword= catchAsyncErrors( async (req, res, next) =>{
        
     const user= await User.findOne({email:req.body.email});

     if(!user){
          return next(new ErrorHandler('User does not exist with this email',404)) 
     }
     //get reset token
     const resetToken= user.generatePasswordResetToken();
     //console.log(resetToken);

     await user.save({validateBeforeSave: false});

     //create reset password url
     // const resetUrl= `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
     const resetUrl= `${process.env.FRONTEND_URL}/password/reset/${resetToken}`


     const message= `Your password reset token is as follow:\n\n${resetUrl}\n\n
                     if you have not requested it then ignore it.`


     try {
          await sendEmail({
                         email: user.email,
                         subject: 'PoppYfi Password Reset',
                         message
                    })
          
                    res.status(200).json({
                         success: true,
                         message: `An email has been sent to: ${user.email}`
                    })
          
     } catch (error) {
          user.resetPasswordToken= undefined;
          user.resetPasswordExpire= undefined;

          await user.save({validateBeforeSave: false});

          return next(new ErrorHandler(error.message,500))
     }
})


//Reset Password => /api/v1/password/reset/:token

exports.resetPassword= catchAsyncErrors( async (req, res, next) =>{

     //Hash URL token
     const resetPasswordToken= crypto.createHash('sha256').update(req.params.token).digest('hex');

     const user= await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: {
               $gt: Date.now()
          }
     });

     if(!user){
               return next(new ErrorHandler('Password reset token is invalid or has expired',400))
          }

     if(req.body.password!== req.body.confirmPassword){
               return next(new ErrorHandler('Passwords do not match',400))
     }

     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
     req.body.password = hashedPassword;


//   Setup new password:
      user.password = req.body.password;

      //destroy the token after setup;
      user.resetPasswordToken= undefined;
      user.resetPasswordExpire= undefined;

      await user.save();
      sendToken(user,200,res);
})


//After login
//Get currently logged in user details => /api/v1/me
exports.getUserProfile= catchAsyncErrors( async (req, res, next) => {
     const user= await User.findById(req.user.id);
     res.status(200).json({
          success: true,
          user
     })
})


//update/change password => api/v1/password/update
exports.updatePassword= catchAsyncErrors( async (req, res, next) => {
     const user= await User.findById(req.user.id).select('+password');

     //check previous user password
     const isMatched= await user.comparePassword(req.body.oldPassword);
     if(!isMatched){
          return next(new ErrorHandler('Incorrect old password'))
     }
     user.password= req.body.password;
     await user.save();

     sendToken(user,200,res);
})

//update user profile which is loggedin => /api/v1/me/update
exports.updateProfile= catchAsyncErrors( async (req,res,next)=>{
     const newUserData= {
          name: req.body.name,
          email: req.body.email
     }
     //update avatar 
     if(req.body.avatar!==''){
          const user= await User.findById(req.user.id);
          console.log(user.avatar);
          

          const image_id= user.avatar.public_id;
          const res= await cloudinary.v2.uploader.destroy(image_id);
     }

     const result= await cloudinary.v2.uploader.upload(req.body.avatar,{
          folder: 'avatars',
          width:150,
          crop: 'scale'
     })

     newUserData.avatar={
               public_id: result.public_id,
               url: result.secure_url
          }


     const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
          new:true,
          runValidators:true,
          useFindAndModify:true
     });
     
          res.status(200).json({
               success: true,
          })
})

//Logout User => /api/v1/logout

exports.logout = catchAsyncErrors( async (req,res,next) => {

     res.cookie('token',null,{
          expires: new Date(Date.now()),
          httpOnly: true
     })

     res.status(200).json({
          success: true,
          message: 'Successfully logged out'
     })
})


//Admin Routes

//Get all users => /api/v1/admin/users
exports.allUsers= catchAsyncErrors( async (req,res,next) => {
     const users= await User.find();
          res.status(200).json({
               success: true,
               UsersCount: users.length,
               users
          })
})

//Get user details => /api/v1/admin/user/:id
exports.getUserDetails= catchAsyncErrors(async (req,res,next)=>{
     const user= await User.findById(req.params.id);
     if(!user){
          return next(new ErrorHandler(`User does not found with id:${req.params.id}`,404))
     }

     res.status(200).json({
          success: true,
          user
     })
})


//update user profile => /api/v1/admin/user/:id
exports.updateUser= catchAsyncErrors( async (req,res,next)=>{
     const newUserData= {
          name: req.body.name,
          email: req.body.email,
          role: req.body.role
     }
     //update avatar => TODO
     const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
          new:true,
          runValidators:true,
          useFindAndModify:true
     });
     
          res.status(200).json({
               success: true,
          })
})


//Delete user  => /api/v1/admin/user/:id
exports.deleteUser= catchAsyncErrors(async (req,res,next)=>{
     const user= await User.findById(req.params.id);
     if(!user){
          return next(new ErrorHandler(`User does not found with id:${req.params.id}`,404))
     }

     //Remove Avatar from cloudinary => TODO

     await user.deleteOne();

     res.status(200).json({
          success: true
          })
})
