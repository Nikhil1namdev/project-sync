import express from 'express'
import { Login, Signup, GoogleAuth, ForgotPassword, ResetPassword, getAllUsers } from '../auth/LoginandSignup.js';
import { protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.post("/Login",Login);
router.post("/Signup",Signup)
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);
router.post("/google-auth", GoogleAuth);
router.get("/google-auth", GoogleAuth);
router.get("/users", protect, getAllUsers);

// Token verification endpoint — called on app load to confirm stored token is still valid
router.get("/verify", protect, (req, res) => {
  res.status(200).json({
    valid: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic || null,
    }
  });
});

export default router