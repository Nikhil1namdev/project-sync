import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const GoogleClientId = process.env.GOOGLE_CLIENT_ID;
const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!GoogleClientId || !GoogleClientSecret) {
  console.warn("WARNING: Google OAuth credentials (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET) are missing from your backend .env file!");
}

// 'postmessage' is required for exchanging auth code from frontend
const oauth2Client = new google.auth.OAuth2(
  GoogleClientId,
  GoogleClientSecret,
  "postmessage"
);

export default oauth2Client;
