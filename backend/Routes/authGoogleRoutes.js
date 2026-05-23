// routes/auth.js
import express from 'express'
import { GoogleAuth } from '../auth/LoginandSignup';
// const { GoogleAuth } = require('google-auth-library');
const router = express.Router();

router.post("/google-auth", GoogleAuth);

module.exports = router;
