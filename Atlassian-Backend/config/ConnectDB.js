import mongoose from "mongoose";
import dotenv from "dotenv";

const Url = process.env.DB_URL||'mongodb+srv://DevanshJain:dev123@cluster0.ndtzn2d.mongodb.net/';

const ConnectDB = async () => {
  try {
    await mongoose.connect(Url)
    console.log("The DataBase is Connected")
  } catch (error) {
    console.log(error);
  }
};
export default ConnectDB;
