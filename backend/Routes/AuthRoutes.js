import express from 'express'
import { Login, Signup, GoogleAuth, ForgotPassword, ResetPassword } from '../auth/LoginandSignup.js';

const router=express.Router();

router.post("/Login",Login);
router.post("/Signup",Signup)
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);
router.post("/google-auth", GoogleAuth);
router.get("/google-auth", GoogleAuth);
export default router