# Project-Sync (Atlassian Jira Clone)

Project-Sync is a production-ready, full-stack Atlassian Jira clone designed to provide a premium, collaborative workspace for development teams. The project implements robust user registration/login frameworks (local JWT & Google OAuth), live responsive dashboards with custom workspace tabs, interactive Kanban boards, interactive spreadsheet issue managers, and real-time Socket.io instant messaging capabilities.

---

## 🚀 Tech Stack

### Frontend
- **React (v19)** - Event-driven declarative user interface.
- **Vite** - High-speed hot module compilation & building.
- **Tailwind CSS (v4)** - Sleek, dynamic utility styling.
- **React Router Dom (v7)** - Seamless nested client route gating.
- **Socket.io-Client** - Low-latency bidirectional socket network layer.

### Backend
- **Node.js (v23)** - Event-driven JavaScript server runtime.
- **Express.js (v5)** - Modular REST routing backend architecture.
- **MongoDB & Mongoose** - Document ODM for flexible data storage.
- **Socket.io** - Multi-user websocket events coordinator.
- **bcrypt & jsonwebtoken** - Hashed credentials and signed session claims.

---

## 📁 Repository Folder Structure

```
Project-Sync (Root Workspace)
├── backend/                  # Node.js / Express API server & Socket.io logic
├── frontend/                 # React / Vite / Tailwind single-page application
└── docs/                     # Full Technical Onboarding and Feature Documentation
```

For a comprehensive file-by-file map, please review the [Folder Structure Documentation](docs/folder-structure.md).

---

## 📊 Feature & Implementation Status

| Feature | Category | Implementation State | Technical Details |
| :--- | :--- | :--- | :--- |
| **Authentication** | Local Signup/Login | **Implemented** | Password hashing with `bcrypt` (10 rounds), signed JWT tokens. |
| | Google SSO | **Implemented** | Client authorization loop, backend exchange with `googleapis`. |
| | Route Gating | **Implemented** | Nested `<Route>` wrapping checks inside `<ProtectedRoute />`. |
| **Kanban Board** | Task dragging | **Implemented** | Responsive columns and overlays powered by `@dnd-kit/core`. |
| | Persistence | **Partial** | Frontend uses local states; CRUD routes are active on the server. |
| **Task CRUD** | Spreadsheet Table | **Implemented** | Grid display query list and posting of new rows to MongoDB. |
| **Messaging** | Team Sockets Chat | **Implemented** | Event broadcasters powered by `Socket.io` with DB logging. |
| **Billing** | SaaS Pricing | **UI Only** | Beautiful subscription pricing tier cards on `/pricing`. |

---

## ⚙️ Environment Variables Needed

Create a `.env` file inside the `/backend` folder and populate it with these keys:

```ini
PORT=8000
DB_URL=mongodb://127.0.0.1:27017/myTestDB
JWT_SECRET_KEY=YourDeveloperAuthJWTSecretKeyGoesHere
GOOGLE_CLIENT_ID=GoogleClientAuthenticationIdForSSOLogin
GOOGLE_CLIENT_SECRET=GoogleClientAuthenticationSecretKey
```

---

## 🛠️ Running the Application

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed and [MongoDB Compass](https://www.mongodb.com/products/compass) running locally on port `27017` (or provide a cloud Atlas cluster URL inside the backend `.env`).

### 2. Start the Backend API Server
```bash
# Navigate to the backend directory
cd backend

# Install server dependencies
npm install

# Boot the API and Socket server with nodemon
npm run start
```
The server will boot and display:
```
🚀 Server running on http://localhost:8000
The DataBase is Connected
```

### 3. Start the Frontend React Client
Open a new terminal session in the root workspace folder:
```bash
# Navigate to the frontend directory
cd frontend

# Install client packages
npm install

# Start the Vite HMR dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the project!

---

## 📖 Deep Technical Documentation Center
We have generated a thorough `/docs` system mapping every architectural sector of the repository. Use these resources to audit, debug, or prepare for codebase walkthroughs:

1. [Project Overview](docs/project-overview.md) - Tech details and implementation maps.
2. [Authentication Module](docs/authentication.md) - JWT, SSO, and route guarding logic.
3. [Client-side Routing](docs/routing.md) - Routing trees, layouts, and wildcards.
4. [Real-time Chat](docs/realtime-chat.md) - Socket connection and event mappings.
5. [Kanban Boards](docs/kanban-board.md) - Drag-and-drop column interaction guides.
6. [Task List CRUD](docs/task-list-crud.md) - Spreadsheet tracker database flows.
7. [Dashboard Shell](docs/dashboard-ui.md) - Sidebar and dynamic tabs mechanics.
8. [Database Models](docs/database-models.md) - Database schemas and ER diagrams.
9. [Backend Server Specs](docs/backend-architecture.md) - Routing, controllers, and middlewares.
10. [Frontend SPA Structure](docs/frontend-architecture.md) - Compilation flows and context.
11. [Folder Structure](docs/folder-structure.md) - Comprehensive repository file map.
12. [Production Deployment](docs/production-notes.md) - Case-sensitivity, environment, and cloud tips.
13. [Future Improvement Roadmap](docs/future-improvements.md) - Planned features and enhancements.
