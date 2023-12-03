const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`.cyan.underline);
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

module.exports = connectDb;
