import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import oauth2Client from "../utils/googleClient.js";
import axios from "axios";
import { Resend } from 'resend';

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
      { expiresIn: "30d" }
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
    const cryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: cryptedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User Registered Successfully", user: newUser });
  } catch (error) {
    console.error(`Register error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
};

// GOOGLE LOGIN CONTROLLER
const GoogleAuth = async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    console.log("GOOGLE OAUTH USER DATA RETRIEVED:", userRes.data);

    const { email, name, picture } = userRes.data;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({ name, email, profilepic: picture });
    } else if (picture) {
      // Sync Google picture on every login to keep it fresh and fix legacy/stale records
      if (user.profilepic !== picture) {
        user.profilepic = picture;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        profilepic: user.profilepic,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// FORGOT PASSWORD CONTROLLER (RESEND SMTP INTEGRATION)
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account associated with this email address." });
    }

    // Generate a secure JWT reset token expiring in 15 minutes
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const apiKey = process.env.RESEND_API_KEY;

    // Check if a valid Resend key is supplied
    if (apiKey && apiKey.startsWith("re_")) {
      const resend = new Resend(apiKey);
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Reset your Project-Sync password',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="background-color: #2563eb; color: white; font-family: sans-serif; font-weight: 900; font-size: 20px; padding: 8px 14px; border-radius: 8px; margin-right: 10px; display: inline-block;">P</div>
                <span style="font-size: 20px; font-weight: bold; color: #1e293b; font-family: sans-serif; vertical-align: middle;">Project-Sync</span>
              </div>
              <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; font-family: sans-serif;">Reset your Project-Sync password</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 24px; font-family: sans-serif;">
                Hi <strong>${user.name}</strong>,<br/><br/>
                We received a request to recover the password for your Project-Sync account associated with <strong>${user.email}</strong>.
              </p>
              <p style="color: #e11d48; font-size: 12px; font-weight: 700; margin-bottom: 24px; font-family: sans-serif;">
                ⚠️ Note: This password recovery link will expire in 15 minutes.
              </p>
              <div style="margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; font-weight: bold; font-size: 14px; border-radius: 8px; display: inline-block; font-family: sans-serif; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.25);">Reset Your Password</a>
              </div>
              <p style="color: #475569; font-size: 12px; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; font-family: sans-serif;">
                If you did not request a password reset, you can safely ignore this email. Your workspace remains secure.<br/><br/>
                <strong>One account for all your synchronized workspaces.</strong>
              </p>
            </div>
          `
        });
        return res.status(200).json({ message: "Recovery email successfully sent to your inbox!" });
      } catch (sendError) {
        console.error("Resend API delivery error:", sendError.message || sendError);

        // Resend Sandbox Fallback: Since sandbox only allows sending to the Resend account creator,
        // we print the error in console and gracefully return the resetLink so testing never fails!
        return res.status(200).json({
          message: `Resend sandbox restriction detected! [TEST MODE ENFORCED] Link: ${resetLink}. (Verifying a custom domain in Resend unlocks sending to all emails).`
        });
      }
    } else {
      // Secure fallback explanation in Dev mode if the API key is not supplied
      console.log(`[TEST MODE] Recovery link requested for ${email}. Link: ${resetLink} (Provide RESEND_API_KEY in backend/.env to trigger real emails).`);
      return res.status(200).json({ 
        message: `Recovery link generated! [TEST MODE] Link: ${resetLink}. Configure RESEND_API_KEY in backend/.env to send actual emails.` 
      });
    }

  } catch (error) {
    console.error("Forgot Password error:", error);
    return res.status(500).json({ message: "Server error during recovery." });
  }
};

// RESET PASSWORD CONTROLLER (JWT TOKEN VALIDATION & DB UPDATE)
const ResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required." });
    }

    let decoded;
    try {
      // Verify JWT token legitimacy and check expiration times
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtErr) {
      console.error("JWT Verification failed:", jwtErr);
      return res.status(400).json({ message: "The recovery link is invalid or has expired." });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Associated account not found." });
    }

    // Cryptographically hash the new password safely
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`🚀 Password successfully updated for account: ${user.email}`);

    return res.status(200).json({ message: "Password updated successfully! You can now log in." });

  } catch (error) {
    console.error("Reset Password error:", error);
    return res.status(500).json({ message: "Server error during password resetting." });
  }
};

export { GoogleAuth, Login, Signup, ForgotPassword, ResetPassword };
