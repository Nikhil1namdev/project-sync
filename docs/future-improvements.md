# Future Improvements Roadmap

## 1. Roadmap Overview
Project-Sync is a solid prototype with fully functional authentication, structured schemas, real-time messaging, and high-fidelity dashboards. To build an industry-level product fit for production, the development team has prioritized a series of feature extensions, architectural refactors, and persistence integrations.

- **Status:** **Planned Features Roadmap**

---

## 2. Priority Enhancements & Tasks

### A. Kanban Persistence (High Priority)
- **Current Status:** UI-Only / Local State. Dragging updates react state arrays but vanishes on page refresh.
- **Action Plan:**
  1. Add a `status` field to the task objects in `TableModel`.
  2. Implement an `axios.put('http://localhost:8000/List/' + taskId)` call inside the `handleDragEnd` handler in `ToDolist.jsx`.
  3. Update the backend `upDateList` controller signature from `async (params)` to `async (req, res)` so it doesn't crash on invocation.
  4. Query `TableModel.findByIdAndUpdate(id, { Status: newStatus })` in the database to save column locations permanently.

### B. Socket.io Real-time Board Sync (High Priority)
- **Current Status:** Real-time updates are isolated strictly to Chat.
- **Action Plan:**
  1. Emit `socket.emit('taskMoved', { taskId, targetColumn })` from the client whenever drag-and-drop ends.
  2. The server catches the event and broadcasts `io.emit('boardSync', { taskId, targetColumn })` to other sockets.
  3. Other clients catch `'boardSync'` and shift their task columns dynamically, reflecting collaborator changes instantly.

### C. Context Hydration & Session Preservation (High Priority)
- **Current Status:** Refreshing the browser blanks out React state, triggering unexpected signouts back to `/login` despite active local storage contents.
- **Action Plan:**
  1. Uncomment and correct the rehydration logic inside `frontend/Context/LoginContext/LoginProvider.jsx`.
  2. On component mount, scan `localStorage.getItem('userInfo')`.
  3. Parse the data and invoke `setUser(parsed.name)`, `setToken(parsed.token)`, and `setLogin(true)` so pages load authenticated states on refresh.

### D. Stripe SaaS Subscriptions (Medium Priority)
- **Current Status:** The `/pricing` page renders premium SaaS tiers ("Starter" and "Company") but has no active business endpoints.
- **Action Plan:**
  1. Integrate Stripe SDK inside frontend and `@stripe/stripe-js` inside the backend.
  2. Create `/billing/checkout` endpoint to issue Stripe checkout sessions.
  3. Mount webhook listeners to capture subscription updates and set account tier levels in `UserModel`.

### E. GitHub OAuth Integration (Low Priority)
- **Current Status:** Google OAuth is active; GitHub is missing.
- **Action Plan:**
  1. Set up OAuth credentials in the GitHub Developer console.
  2. Add a styled "Login with GitHub" icon button to `LoginOne.jsx`.
  3. Direct clicking to the GitHub authorize URI, trade code on backend, and map the return payload to `UserModel` collections.
