# Frontend Architecture

## 1. Feature Overview
The frontend of Project-Sync is a highly responsive Single Page Application (SPA) designed to wow users. It is constructed using React 19, compiled with the high-performance Vite builder, and styled using Tailwind CSS v4 to establish a premium dark theme.

- **Status:** **Implemented** (Structured, modular frontend codebase inside `frontend/`).

---

## 2. What I Learned
- **Vite Bundler Toolchain:** Running super-fast hot module replacements (HMR) and compiling clean static assets.
- **Global React Context API:** Creating global hooks to broadcast credentials across nested layouts without drilling props.
- **Tailwind Utility Tokens:** Utilizing color gradients, shadows, and smooth hover animations to deliver a high-fidelity SaaS style.
- **State Partitioning:** Deciding when state must live globally (auth status) versus when it should remain local (input forms, active tabs).

---

## 3. Core Component Layout
All resources reside inside `frontend/src/` and `frontend/Context/`.

### A. Root Hierarchy
```
[main.jsx] (Vite entry)
   └─ [App.jsx] (Root Coordinator)
        ├─ [LoginProvider] (Auth Context)
        │    └─ [GoogleOAuthProvider] (SSO SDK Wrapper)
        │         └─ [BrowserRouter] (Navigation Router)
        │              └─ [Routes / Pages]
```

### B. Directory Breakdown
- **`Context/`:** Central state management for user profile details and access flags.
- **`src/pages/`:** Direct layouts targeted by routes (e.g. Home, pricing, login, dashboard shell).
- **`src/features/`:** Stateful functional modules like the Kanban Board (`ToDolist`) or spreadsheet CRUD (`ListFeature`).
- **`src/components/`:** Presentational components like Navbar headers, table rows, and chat widgets.
- **`src/utils/`:** Network configuration scripts and external API hooks.

---

## 4. State Flow & Context Architecture
```javascript
// Context Provider Definition (LoginProvider.jsx)
const LoginProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState(null);

  return (
    <CreateLoginContext.Provider value={{ User, login, token, setLogin, setUser, setToken }}>
      {children}
    </CreateLoginContext.Provider>
  );
};
```
Any component can extract or modify these coordinates using the React `useContext` hook:
```javascript
const { User, login, setLogin } = useContext(LoginContext);
```

---

## 5. Important Code Flow (Interview Preparation)
1. **User visits application:**
   - Vite loads `main.jsx` -> mounts `<App />`.
   - `<App />` wraps the DOM in `<LoginProvider>` to establish global authentication states.
2. **Accessing Routes:**
   - User transitions to `/JiraDashboard`.
   - React Router executes `<ProtectedRoute />`.
   - Intercepts state check: `login` context is verified.
3. **Rendering Widgets:**
   - User opens Chat.
   - Socket client hooks establish connection on component mount.
   - Real-time updates re-render chat states dynamically.

---

## 6. Future Backend & Production Improvements
- **Context State Rehydration:** Currently, refreshing the browser empties the React state, sending the user back to the login screen. Re-enable safe `localStorage` reading inside `LoginProvider`'s `useEffect` to ensure seamless sessions.
- **State Management Scale-up:** If the application expands to track hundreds of active boards, workspaces, and chat channels, transition from Context API to lightweight state managers like `Zustand` or `Redux Toolkit` to limit unnecessary parent re-renders.
- **CSS Variable Centralization:** Create standard HSL dark mode color variables inside `frontend/src/index.css` to enable rapid color themes.
