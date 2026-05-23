import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import oauth2Client from "../utils/googleClient.js";

import axios from "axios";

// LOGIN CONTROLLER
const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const JWTSecretKey = process.env.JWT_SECRET_KEY; // ✅ Correct spelling and capitalization
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect Password" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWTSecretKey,
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token, // ✅ Send token
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(`Login error: ${error}`);
      return res.status(500).json({ message: "Server error" });
    }
  };
  

// REGISTER CONTROLLER
const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const cryptedPassword= await bcrypt.hash(password,10)
    const newUser = new UserModel({ name, email, password:cryptedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User Registered Successfully", user: newUser });
  } catch (error) {
    console.error(`Register error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
};

// GOOGLE LOGIN CONTROLLER
const  GoogleAuth = async (req, res) => {
  const code = req.query.code;
 // ✅ updated from req.query.code

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({ name, email, image: picture });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        profilepic: user.image,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { GoogleAuth, Login, Signup };

