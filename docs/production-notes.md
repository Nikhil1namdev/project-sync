# Production & Deployment Notes

## 1. Feature Overview
Moving from a local development sandbox to a secure, highly scalable production cloud environment requires careful adjustments to network settings, database configurations, process managers, and deployment pipelines.

- **Status:** **Guidelines & Active Setup Configs**

---

## 2. Critical Production Considerations

### A. Case-Sensitivity Warnings (Windows vs. Linux)
- **Problem:** Windows operating systems ignore case mismatch in imports (e.g. importing `../models/Message.js` when the actual folder is `backend/Models`). When deployed to Linux hosts (like Render, Railway, Vercel, or AWS EC2), the build pipeline will fail with a `"module not found"` crash.
- **Action:** Ensure all backend model imports strictly reference `../Models/` with an uppercase `M`.

### B. Environment Variables Setup
Production servers must possess their own distinct `.env` configs. Never commit production secrets to Git!
Configure the following in your host environment panels:
```ini
PORT=8000
DB_URL=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/production_db?retryWrites=true&w=majority
JWT_SECRET_KEY=YourSuperComplexSafeProductionKeyHexHashStrings
GOOGLE_CLIENT_ID=ProductionGoogleClientId
GOOGLE_CLIENT_SECRET=ProductionGoogleClientSecret
```

### C. CORS Mappings & Security Policies
- **Problem:** Currently, backend `server.js` initializes `app.use(cors())` which exposes endpoints globally to all clients.
- **Action:** Lock down access to your specific client domain inside `backend/server.js`:
  ```javascript
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "https://project-sync-app.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
  ```

---

## 3. Deployment Steps on Cloud Platforms

### Frontend Deployment (Netlify / Vercel)
1. **Connect Repository:** Link your GitHub repo to the platform.
2. **Set Root Directory:** Set root directory to `frontend`.
3. **Build Commands:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Settings:** Declare `VITE_API_BASE_URL` pointing to the live backend server.
5. **Configure Redirects:** Add a `_redirects` file under `public/` containing `/* /index.html 200` to prevent page-refresh 404 crashes inside SPA React Router frameworks.

### Backend Deployment (Render / Railway / Heroku)
1. **Connect Repository:** Link repo to the server host platform.
2. **Set Root Directory:** Set root directory to `backend`.
3. **Build & Start Commands:**
   - Build Command: `npm install`
   - Start Command: `node server.js` (Avoid `nodemon` in production since it restarts servers excessively).
4. **Environment Settings:** Fill all variables (PORT, DB_URL, JWT_SECRET_KEY, etc.).
5. **Keep-Alives:** If using free tiers, set up a cron job pinging the backend domain every 14 minutes to prevent server hibernation.
