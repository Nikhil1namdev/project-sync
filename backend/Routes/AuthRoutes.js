import express from 'express'
import { Login, Signup,GoogleAuth } from '../auth/LoginandSignup.js';

const router=express.Router();

router.post("/Login",Login);
router.post("/Signup",Signup)
router.post("/google-auth", GoogleAuth);
router.get("/google-auth", GoogleAuth);
// router.post("/google-auth", GoogleAuth);
export default router