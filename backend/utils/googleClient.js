import { google } from 'googleapis';
import dotenv from 'dotenv'
const GoogleClientId = '295710850192-us1jv41mns6mhknr0tp95qdcbnlrbl77.apps.googleusercontent.com';
const GoogleClientSecret = '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';

// 'postmessage' is required for exchanging auth code from frontend
const oauth2Client = new google.auth.OAuth2(
  GoogleClientId,
  GoogleClientSecret,
  'postmessage'
);

export default oauth2Client;
