import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  profilepic: { type: String },
  password: { type: String }, // Optional if using Google login
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
