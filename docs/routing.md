# Frontend Routing & Flow

## 1. Feature Overview
Project-Sync relies on a nested, declarative router using React Router DOM (v7) that partitions the application into public-facing pages, authentication pages, protected dashboards, and wildcard fallback views.

- **Status:** **Implemented** (Dynamic Routing System)

---

## 2. What I Learned
- **React Router Nested Route Structures:** Wrapping child routes under a single layout or route guard component.
- **Outlet Component:** Providing a placeholder for nested route components to mount.
- **Dynamic Link & Navigate Components:** Triggering transitions without refreshing the document.
- **Case-Sensitive Routes:** Aligning paths (e.g. converting case-sensitive paths `/PricingPage` to `/pricing`).
- **Wildcard Catch-Alls (`*`):** Displaying styled fallback pages for unrecognized routes.

---

## 3. How It Was Used In This Project
All routing is declared in `frontend/src/App.jsx`.

### A. Complete Route Map
```
/                      ➔ Home (Public Landing Page)
/Login                 ➔ LoginOne (Auth Login Form)
/Signup                ➔ SignUp (Auth Registration Form)
/pricing               ➔ PricingPage (Public Pricing Tier Card Page)
└─ Protected Routes (Protected by ProtectedRoute.jsx)
    ├── /JiraDashboard ➔ JiraDashboard (Main interactive workspace shell)
    ├── /ToDoList      ➔ ToDolist (Kanban Board)
    ├── /UserDashboard ➔ UserDashboard (Secondary user panel)
    ├── /FinalDashboard➔ FinalDashboard (Alternate dashboard layout)
    ├── /Jira          ➔ Jira (Dashboard component)
    └── /User/ListFeature ➔ ListFeature (Spreadsheet-like interactive task table)
*                      ➔ Catch-All 404 (Sleek Page Coming Soon view)
```

### B. Route Guard Architecture
Public routes do not require any state validation.
Protected routes are grouped together under a parent route:
```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/JiraDashboard" element={<JiraDashboard />} />
  <Route path="/ToDoList" element={<ToDolist />} />
  ...
</Route>
```
If the user's `login` context is false, `ProtectedRoute` replaces the active view with `/login` dynamically.

---

## 4. Project Architecture Notes
- **State Integration:** The router is wrapped by the global `LoginProvider` context to allow immediate intercept checks inside `ProtectedRoute`.
- **Navigation Controls:** The navbar contains links like `<Link to="/pricing">Pricing</Link>` to drive routes smoothly.
- **Authentication Redirects:** Forms call `const navigate = useNavigate(); navigate('/JiraDashboard')` on successful operations.

---

## 5. Important Code Flow (Interview Preparation)
1. **User enters browser on `http://localhost:5173/`:**
   - React router mounts `<Home />`.
2. **User clicks "Pricing":**
   - Router transitions internally to `/pricing` and mounts `<PricingPage />` without server round-trips.
3. **User tries to open `/JiraDashboard` directly:**
   - Router intercepts and loads `<ProtectedRoute />`.
   - Context is checked (`login` state).
   - If false, `<Navigate to="/login" replace />` fires.
   - User is sent back to `/Login`.
4. **User logs in:**
   - Context updates `login` to true.
   - `navigate('/JiraDashboard')` is called.
   - Router mounts `<JiraDashboard />` displaying their user environment.

---

## 6. Future Backend & Production Improvements
- **Lazy Loading (Code Splitting):** High-weight dashboard pages should be loaded lazily using `React.lazy()` or dynamic `import()` to reduce bundle size and initial load speeds.
- **Authentication Handshake:** Guard checking should ideally hit a token-validation backend endpoint on reload to prevent users from bypassing local validation if client states are manipulated.
