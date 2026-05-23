# Backend Architecture

## 1. Feature Overview
The backend of Project-Sync is a Node.js runtime built on Express, integrated with MongoDB, and augmented with Socket.io. It handles user authentication, serves spreadsheet data, listens to chat events, and records records safely in the cloud or local MongoDB Compass instances.

- **Status:** **Implemented** (Production-ready Express-Socket server, running on port `8000`).

---

## 2. What I Learned
- **Modular Routes/Controllers Separation:** Segmenting URL paths into separate routing tables and offloading core operations to individual controller modules.
- **Environment Management:** Isolating secrets (ports, database logins, token hashes) inside local `.env` files using `dotenv`.
- **Stateless Session Issuance (JWT):** Creating, signing, and returning lightweight, tamper-proof user claims.
- **Dynamic CORS Mappings:** Enabling secure cross-origin communication between the client and API servers.

---

## 3. Core Component Layout
- **File References:**
  - Entry Server: `backend/server.js`
  - DB Config: `backend/config/ConnectDB.js`
  - Routers: `backend/Routes/`
  - Controllers: `backend/controller/`
  - Authentication: `backend/auth/`
  - Google SDK client: `backend/utils/googleClient.js`

### A. HTTP Server & Socket.io Coordination
Instead of mounting sockets on separate ports, the system bonds them to the same HTTP server, simplifying host mapping:
```javascript
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});
```

### B. Route Middleware Mounting
Standardizes processing rules for JSON request payloads and routes endpoints cleanly:
```javascript
app.use(express.json());
app.use(cors());

app.use("/List", ListFeatureRoutes);
app.use("/auth", AuthRoutes);
app.use("/messages", MessageRoutes);
```

---

## 4. Backend Architecture Flow Map
```
[Client App] ➔ [Port 8000]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   [HTTP Routes]     [Socket Events]
        │                   │
  ┌─────┼─────┐             ├───────────────┐
  ▼     ▼     ▼             ▼               ▼
[Auth] [List][Chat]   [sendMessage]  [disconnect]
  │     │     │             │
  └─────┼─────┴─────────────┤
        ▼                   ▼
 [Mongoose Schemas] ➔ [MongoDB Engine]
```

---

## 5. Important Code Flow (Interview Preparation)
1. **Bootstrap (`node server.js`):**
   - Loads `.env` environment variables.
   - `ConnectDB()` calls Mongoose to log onto database.
   - Mounts Express routers.
   - Starts Socket server listening on Port `8000`.
2. **REST Request Resolution:**
   - User hits `POST /auth/Signup`.
   - Router delegates to `Signup` inside `LoginandSignup.js`.
   - Controller handles password hashing and writes record.
   - Controller returns structured response.
3. **Socket Event Loop:**
   - Client sends message payload via `"sendMessage"`.
   - Socket receiver writes payload to database.
   - Sockets server issues `"receiveMessage"` rebroadcast to all connected sockets.

---

## 6. Future Backend & Production Improvements
- **Standardized API Responses:** Refactor controllers (`ListController.js`) to guarantee structured, uniform JSON responses (e.g. `{ success: true, data: [...] }`) with appropriate status codes on success and failure.
- **Input Validation Middleware:** Use schema validation packages like `Joi` or `yup` to sanitize incoming request bodies before they reach controllers.
- **Centralized Error Handling:** Mount a custom Express error-handling middleware (`app.use((err, req, res, next) => { ... })`) to intercept crashes and log neat, obfuscated warnings instead of dropping server connections.
