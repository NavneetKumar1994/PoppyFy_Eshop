const Product= require('../models/product');

const dotenv= require('dotenv')
const connectDatabase= require('../config/database')

const products= require('../data/products');

//setting dotenv files

dotenv.config({path:'config/config.env'})

connectDatabase();

const seedProducts= async ()=> {
     try{
          await Product.deleteMany();

          await Product.insertMany(products);
          console.log("All products are added");
          process.exit();

     }catch(error){
          console.log(error.message);
          process.exit();
     }
}

seedProducts();