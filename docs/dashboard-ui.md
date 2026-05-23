# Dashboard UI Shell

## 1. Feature Overview
The Dashboard UI Shell is the heart of the Project-Sync application. Built to mimic Atlassian's modern, product-focused workspace, it provides a centralized portal featuring a customizable persistent sidebar, product discovery highlights, and stateful navigation tabs to switch between the Kanban Board, Issue Tracker Spreadsheet, and Group Collaboration chats.

- **Status:** **Implemented** (Visual responsive dashboard and stateful tab panels; Starred and Summary panels are visual placeholders).

---

## 2. What I Learned
- **Dynamic Component Rendering:** Switching active component trees inside a parent element based on a string-driven state variable (`activeTab`).
- **Responsive Flexbox Layouts:** Partitioning viewports into fixed navigation sidebars, scrollable main action panes, and floating discovery drawers.
- **Icon Integrations:** Using standard UI icon libraries (`react-icons`) to establish professional, premium visual weight.
- **Context API Consumption:** Fetching and rendering user profile details globally to provide customized greetings like `"Hello ! Nitin"`.

---

## 3. How It Was Used In This Project
The Dashboard acts as the primary hub of the logged-in user experience.
- **File References:**
  - Layout file: `frontend/src/pages/JiraDashboard/JiraDashboard.jsx`
  - Kanban component: `frontend/src/features/ToDolist.jsx`
  - Spreadsheet component wrapper: `frontend/src/pages/JiraDashboard/Jira.jsx`
  - Chat components: `frontend/src/components/ChatComponents/Chat.jsx` & `frontend/src/features/ChatFeature/ChatFeature.jsx`

### Interactive Tab Switching Architecture
The main dashboard utilizes an active tab state hook:
```javascript
const [activeTab, setActiveTab] = useState('Worked on');
const tabs = ['Summary', 'ToDo ', 'Create List/Forms', 'Starred', 'Assigned to me', 'Chat', 'NewChat'];
```
When a tab heading is clicked, the state updates and dynamically shifts the DOM tree:
```jsx
{activeTab === 'ToDo ' && <ToDolist />}
{activeTab === 'Create List/Forms' && <Jira />}
{activeTab === 'Chat' && <ChatFeature />}
{activeTab === 'NewChat' && <Chat />}
```

---

## 4. Project Architecture Notes
- **User Customization:** Displays a user greeting read directly from `LoginContext` (`User`).
- **Recent Project Card:** Styled using a smooth light yellow gradient (`from-yellow-100 to-yellow-200`) providing quick links to open work items.
- **Right Sidebar:** Renders a product promotional highlight widget ("Jira Product Discovery") encouraging users to link prioritized feedback.

---

## 5. Important Code Flow (Interview Preparation)
1. **User logs in:** Context state is updated, routing guards release access, and client opens `/JiraDashboard`.
2. **Dashboard Mount:** Renders fixed-width sidebar (Left) + primary content column (Middle) + advertisement column (Right).
3. **Sidebar Greeting:** Context state processes `User` and displays `"Hello ! [Username]"` in bold text.
4. **Tab Interactivity:** Clicking the `"ToDo "` tab invokes `setActiveTab('ToDo ')`.
5. **Component Swapping:** React intercepts state change, unmounts previous nodes, and initializes the `<ToDolist />` (Kanban Board) in the viewport column.

---

## 6. Future Backend & Production Improvements
- **Tab State Persistence in URLs:** Switch to query-parameter based tabs (e.g. `/JiraDashboard?tab=todo`) so refreshing the browser retains the user's active tab instead of falling back to the default tab.
- **Collapsible Sidebar:** Add a toggle button (`FaAngleDoubleLeft`) to let developers slide the sidebar off-screen, maximizing the work area for heavy Kanban and Spreadsheet workflows.
- **Summary & Starred Implementations:** Connect backend metrics (aggregations) to dynamically render charts, progress meters, and starred projects instead of showing empty placeholders.
