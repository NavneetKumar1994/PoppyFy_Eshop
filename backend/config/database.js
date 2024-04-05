const mongoose= require('mongoose');

const connectDatabase = () => {
     mongoose.connect("mongodb://poppyFy-mongo-db/PoppY_EShop", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         serverSelectionTimeoutMS: 30000, // Timeout after 30s
         socketTimeoutMS: 45000, // Socket timeout after 45s
         connectTimeoutMS: 30000 // Connect timeout after 30s
     })
     .then(con => {
         console.log(`MongoDb database connected with HOST: ${con.connection.host}`)
     })
     .catch(error => {
         console.error('MongoDB connection error:', error);
     });
 }
 

module.exports = connectDatabase;