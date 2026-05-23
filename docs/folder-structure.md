# Repository Folder Structure

## 1. Feature Overview
A clean, modular folder layout is key to managing production-grade SaaS codebases. Project-Sync organizes its workspace into three dedicated directories: `backend` (Express API server), `frontend` (Vite SPA client), and `docs` (technical architecture and developer guides).

- **Status:** **Implemented** (Restructured workspace).

---

## 2. Directory Layout Map
```
Project-Sync (Workspace Root)
├── backend/                       # Node/Express API Server
│   ├── auth/                      # Authentication handlers (Login, Signup, Google OAuth)
│   ├── config/                    # Configuration settings (Database Connectors)
│   ├── controller/                # REST API request handlers & controllers
│   ├── Models/                    # MongoDB Mongoose database schema models
│   ├── Routes/                    # HTTP route mappings (Auth, Lists, Messages)
│   ├── utils/                     # Utility libraries (Google OAuth Client setup)
│   ├── .env                       # Environment secrets (Port, DB URI, JWT keys)
│   ├── .gitignore                 # Backend git ignore rules
│   ├── server.js                  # Express Entry point & Socket.io server
│   ├── package.json               # Backend npm scripts and dependencies
│   └── package-lock.json          # Backend lockfile
│
├── frontend/                      # React / Vite Client Application
│   ├── Context/                   # Global React State Providers (LoginContext)
│   ├── public/                    # Static public assets (Vite logo, icons)
│   ├── src/                       # React client source files
│   │   ├── assets/                # Local images and graphic assets
│   │   ├── components/            # Presentational components (Navbar, Spreadsheet elements)
│   │   ├── features/              # Stateful functional modules (Kanban board, List tables)
│   │   ├── pages/                 # Full routed page layouts (Home, Pricing, Auth, Dashboard)
│   │   ├── utils/                 # Frontend network configurations & API connection utilities
│   │   ├── App.css                # Global component specific CSS
│   │   ├── App.jsx                # Router config & Root React Coordinator
│   │   ├── index.css              # Global Tailwind styling configurations
│   │   └── main.jsx               # Client bootstrapping entrypoint
│   ├── eslint.config.js           # Client linting rules
│   ├── index.html                 # Single page application base template
│   ├── package.json               # Client package scripts & dependency configurations
│   └── vite.config.js             # Vite build settings & dev server configurations
│
├── docs/                          # Project Documentation Center
│   ├── project-overview.md        # High level summary & Tech stack
│   ├── authentication.md          # Local JWT & Google SSO specs
│   ├── routing.md                 # Route mappings and guard guidelines
│   ├── realtime-chat.md           # Websocket messaging layout
│   ├── kanban-board.md            # Drag & Drop boards
│   ├── task-list-crud.md          # Spreadsheet database tracker
│   ├── dashboard-ui.md            # Core dashboard tab shell
│   ├── database-models.md         # Database entities and ER diagrams
│   ├── backend-architecture.md    # Server, Express & Sockets setup
│   ├── frontend-architecture.md   # SPA React state & compilation rules
│   ├── folder-structure.md        # Folder layout map (This file)
│   ├── production-notes.md        # Deployment guidelines & configurations
│   └── future-improvements.md     # Development roadmap and target enhancements
│
└── README.md                      # Workspace-level overview and run guide
```

---

## 3. Core Directory Responsibility Matrix

### `/backend`
- Responsible for verifying credentials, issuing stateless JWT tokens, providing CRUD interfaces for tasks, listening to bi-directional chat socket events, and writing records to MongoDB collections.

### `/frontend`
- Responsible for rendering rich responsive pages, capturing user credentials/form inputs, establishing low-latency websocket connections, and updating visual boards dynamically using React states.

### `/docs`
- Houses technical blueprints, architectural diagrams, developer onboarding guidelines, and rules for future feature additions to assure long-term repository quality.
