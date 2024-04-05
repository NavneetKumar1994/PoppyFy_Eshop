const catchAsyncErrors= require('../middlewares/catchAsyncErrors')
const User= require('../models/user');
const Order= require('../models/order');

const stripe= require('stripe')(process.env.STRIPE_SECRET_KEY);

//Process Stripe payments  => api/v1/payment/process

exports.processPayment= catchAsyncErrors(async(req,res,next)=>{
      
     const user= await User.findById(req.user.id);
     const orders= await Order.find({user:req.user.id})


     const paymentIntent= await stripe.paymentIntents.create({
          // amount: req.body.amount,
          // currency: 'INR',
          // description: 'Example Payment', // Description should be a string
          // metadata: {
          //   integration_check: 'accept a payment'
          // } 
          description: 'PoppYfY_E_Cart_Service',
           shipping: {
             name: user.name,
             address: {
               line1: orders[0].shippingInfo.address? orders[0].shippingInfo.address: 'New User',
               postal_code: orders[0].shippingInfo.postalCode? orders[0].shippingInfo.postalCode: 'New User',
               city: orders[0].shippingInfo.city? orders[0].shippingInfo.city: 'New User',
               country: orders[0].shippingInfo.country==='India' ? 'US': 'New User',
             },
           },
           amount: req.body.amount,
           currency: 'usd',
           payment_method_types: ['card'],
              })
              res.status(200).json({
                            success: true,
                   client_secret: paymentIntent.client_secret
              })
})

//Send Stripe API kEy  => api/v1/stripeapi

exports.sendStripeApi= catchAsyncErrors(async(req,res,next)=>{

     res.status(200).json({
          success: true,
          stripeApiKey: process.env.STRIPE_API_KEY
     })
})