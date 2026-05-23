# Task List CRUD (Table View)

## 1. Feature Overview
The Task List CRUD (Spreadsheet Table View) is an interactive matrix interface that provides deep details on created issues, matching Jira's advanced search and table screens. Users can query, insert, and view issues (with attributes like Key, Summary, Status, Priority, Reporter, and Assignee) stored directly in MongoDB.

- **Status:** **Partially Implemented** (Read and Create operations are fully wired frontend-to-backend; Update and Delete buttons are visually missing or placeholder inside frontend rows).

---

## 2. What I Learned
- **Axios HTTP Client:** Making asynchronous REST API requests (GET/POST) to express routes.
- **Controlled Multi-Input State Forms:** Mapping a single React state object (`newRow`) across several input elements dynamically using unique key attributes.
- **Optimistic Rendering UI Patterns:** Updating the user view immediately on submission to minimize loading lag, paired with proper user feedback alert popups.
- **MongoDB Table Schema Layouts:** Modeling comprehensive tabular spreadsheets including dates, priorities, assignee mappings, and reference ids.

---

## 3. How It Was Used In This Project
The Spreadsheet view provides team members with dense issue analytics.
- **File References:**
  - Main Component: `frontend/src/features/List/ListFeature.jsx`
  - Table Header Component: `frontend/src/components/ListComponents/Thead.jsx`
  - Table Row Component: `frontend/src/components/ListComponents/TRow.jsx`
  - Backend Router: `backend/Routes/ListFeatureRoutes.js`
  - Backend Controller: `backend/controller/ListController.js`
  - Backend DB Model: `backend/Models/TableRowData.js`

### Frontend-to-Backend CRUD Integration
1. **Fetching Data:** On component mount, the `useEffect` trigger executes `fetchData()`, calling `GET http://localhost:8000/List/getList`. The records are saved in state in reverse chronological order using `.reverse()`.
2. **Posting Data:** When the creation form is submitted, `handlePost()` issues a `POST http://localhost:8000/List/NewList` payload containing the `newRow` state. It pushes `response.data` to the list of `rows` optimistically and resets the form inputs.

---

## 4. Project Architecture Notes
- **Input Key Mapper Pattern:** Input tags are rendered iteratively from a mapper array to keep the markup dry:
  ```jsx
  {[
    { label: 'Type', key: 'Types' },
    { label: 'Key', key: 'Key' },
    ...
  ].map(({ label, key }) => (
    <input
      value={newRow[key]}
      onChange={(e) => setNewRow({ ...newRow, [key]: e.target.value })}
    />
  ))}
  ```
- **Context Fallback:** Sets the default assignee string to the currently authenticated user session name (`User` in `LoginContext`).

---

## 5. Important Code Flow (Interview Preparation)
1. **Spreadsheet Mounts:** React renders `<ListFeature />` and triggers `fetchData()` inside a mount-only `useEffect`.
2. **API Call (GET):** Client requests `http://localhost:8000/List/getList`.
3. **Database Fetch:** Backend controller `getAllList()` queries `TableModel.find()` and returns the array as JSON.
4. **State Hydration:** Client sets `rows` state, and the `.map()` loop renders individual `<TRow />` components.
5. **Issue Creation:** User fills fields (e.g. Summary: "Fix login button", Key: "PROJ-12").
6. **API Call (POST):** Client fires `POST http://localhost:8000/List/NewList` containing the issue object.
7. **Database Persistence:** Backend creates a new Mongoose document (`new TableModel(req.body)`), saves it, and frontend updates the local issues array instantly.

---

## 6. Future Backend & Production Improvements
- **Backend Response Bug Fix:** The backend controller's `newList` and `deleteList` methods lack a return response (`res.status(201).json(...)`). The frontend attempts to read `response.data` which returns undefined. The controller must be updated to return the created document explicitly.
- **Backend Route Validation:** The `upDateList` controller references `req` but lacks `req` as a parameters argument (`const upDateList=async (params) => { ... const id=req.params; }`), which crashes the server when triggered. Correct this parameter signature to `(req, res)`.
- **Implement Table Row Edit/Delete UI:** Add edit (pencil) and delete (trash) icons inside `<TRow />` so users can trigger the backend's PUT (`http://localhost:8000/List/:id`) and DELETE (`http://localhost:8000/List/:id`) endpoints.
- **Pagination & Filters:** Implement pagination and priority filters (`?limit=10&page=1`) to prevent heavy database loads as task volumes grow.
