const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb ", conn.connection.host);
  } catch (error) {
    console.log("error while connecting to mongo db", error);
  }
};

module.exports = ("connectDB", connectDB);
