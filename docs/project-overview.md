# Project-Sync (Atlassian Jira Clone) - Project Overview

## 1. Feature Overview
Project-Sync is a high-fidelity full-stack clone of Atlassian's flagship project management application, Jira. The project bridges standard administrative collaboration with robust project tracking tools. It delivers a modern, dark-themed platform equipped with core services like JWT/Google OAuth, interactive Kanban boards, and a real-time messaging workspace.

- **Status:** Partially Implemented / Ongoing Active Development
- **Target Audience:** Development teams and collaborative groups looking for an all-in-one task management and instant communication tool.

---

## 2. Core Tech Stack
The application is built using the industry-proven **MERN** stack along with modern styling and real-time utilities:

### Frontend
- **React (v19):** Declarative component architecture.
- **Vite:** High-performance, lightning-fast next-generation frontend toolchain.
- **Tailwind CSS (v4):** Modern utility-first CSS framework for visual styling.
- **React Router Dom (v7):** Handles advanced single-page client routing.
- **Lucide React & React Icons:** Clean vector icon pack.
- **Socket.io-Client:** Real-time bi-directional network communication channel.

### Backend
- **Node.js (v23):** Scalable, event-driven JavaScript runtime engine.
- **Express.js (v5):** Modular REST API structure and server routing middleware.
- **MongoDB & Mongoose (v8):** Flexible Document-oriented NoSQL database and Object Data Modeling (ODM).
- **Socket.io:** Powers instant real-time events for communication.
- **jsonwebtoken & bcrypt:** Secure JWT issuing and industry-standard password hashing.

---

## 3. Main Features & Implementation Status

| Feature Category | Feature Detail | Current Status | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication** | Email & Password Registration | **Implemented** | Password is encrypted with `bcrypt` (10 rounds). |
| | Email & Password Login | **Implemented** | Authenticates user, signs JWT token, stores user in `localStorage`. |
| | Google OAuth Login | **Implemented** | Custom token-exchange backend using `googleapis` oauth client. |
| | GitHub OAuth | **Missing** | To be added in a future enhancement. |
| | Route Guarding | **Implemented** | Uses Context API and React Router's `<Outlet />` element to protect pages. |
| **Dashboard** | Workspace Dashboard Shell | **Implemented** | Responsive design with a persistent sidebar and custom visual tabs. |
| **Kanban Board** | Local Drag-and-Drop | **Implemented** | Drag tasks between Status columns. |
| | Backend Task Sync | **Partial** | Frontend relies on mock data and local states; backend `TableModel` contains CRUD endpoints but needs direct hooks from Kanban. |
| **Real-time Chat** | Workspace Group Chat | **Implemented** | Real-time chat powered by Socket.io, persisting messages in MongoDB. |
| **Stripe Billing** | Tier Subscription Flow | **UI Only** | SaaS pricing cards with premium buttons but no Stripe API endpoint backend. |

---

## 4. Architectural Rules for Future Feature Additions
Whenever a new feature is added to Project-Sync, the developer must:
1. **Document It:** Add a corresponding markdown file under the `docs/` folder following the standard template (Overview, Lessons Learned, Implementation Flow, File Mapping, Code Snippet, Future Improvements).
2. **Comment Safely:** Write clear, concise developer comments on state changes, API calls, or socket triggers. Do not over-comment obvious variables.
3. **Handle Errors Cleanly:** Always implement try-catch blocks on the backend with accurate HTTP response codes, and handle loading/error indicators on the frontend.
4. **Follow Folder Structures**:
   - Backend controllers go to `backend/controller/`
   - Backend models go to `backend/Models/`
   - Frontend pages go to `frontend/src/pages/`
   - Shared components go to `frontend/src/components/`
