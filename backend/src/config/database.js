const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log to verify
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    //  {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;