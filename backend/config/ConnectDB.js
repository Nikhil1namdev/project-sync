import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/AtlassianDB';

const ConnectDB = async () => {
  try {
    await mongoose.connect(Url)
    console.log("The DataBase is Connected")
  } catch (error) {
    console.log(error);
  }
};
export default ConnectDB;
