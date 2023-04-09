import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = "jhamart";

    await mongoose.connect(DATABASE_URL + "/" + DB_OPTIONS);
    console.log("Database got connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
