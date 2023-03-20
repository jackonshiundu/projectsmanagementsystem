const mongoose = require('mongoose');

const connectDB = (uri) => {
  try {
    mongoose.connect(uri);
  } catch (error) {
    console.log('Something went wrong when connecting to the data base ');
  }
};

module.exports = connectDB;
