const mongoose= require('mongoose');

const productSchema= new mongoose.Schema({

     name:{
          type: String,
          required: [true, 'Please enter product name'],
          trim: 'true',
          maxLength: [100,'Product name cannot exceed 100 charecters']
     },
     price:{
          type: Number,
          required: [true, 'Please enter product price'],
          maxLength: [5,'Product name cannot exceed 5 charecters'],
          default: 0.0
     },
     description:{
          type: String,
          required: [true, 'Please enter product description'],
     },
     ratings:{
          type: Number,
          default:0
     },
     images:[
          {
               public_id: {
                    type: String, 
                    required: true
               },
               url:{
                    type: String, 
                    required: true
               }
          }
     ], 
     category:{
          type: String,
          required: [true, 'Please enter the category of the product'],
          enum:{
               values:[
                    'Electronics',
                    'Accessories',
                    'Food',
                    'Books',
                    'Clothes',
                    'Shoes',
                    'Purses',
                    'Home'
               ],
               message: 'please select correct category for product'
          }
     },
     seller:{
          type: String,
          required: [true, 'Please enter product seller']
     }, 
     stock:{
          type: Number,
          required: true,
          maxLength: [25,'Stock cannot exceed 25'],
          default: 0
     }, 
     numOfReviews:{
          type: Number,
          default:0
     },
     reviews:[
          {
               name: {
                    type: String,
                    required: true
               },
               rating:{
                    type:Number,
                    required:true
               }, 
               comment:{
                    type:String,
                    required: true
               },
               user:{
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: true
               },
          }
     ],
     
     createdAt:{
          type: Date,
          default: Date.now
     }

})

module.exports= mongoose.model('Product',productSchema);