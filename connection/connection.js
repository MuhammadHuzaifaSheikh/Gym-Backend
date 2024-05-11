require('dotenv').config();

const mongoose = require("mongoose");

const CONNECTION_STRING = process.env.CONNECTION_STRING;

const connect = async () => {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/FlexFlow", {

    await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");
    return mongoose.connection;
  } catch (error) {
    console.log(`Error connecting to MongoDB=========: ${error}`);
  }
};

module.exports = connect;
