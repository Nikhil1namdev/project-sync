# Real-Time Chat System

## 1. Feature Overview
Project-Sync includes a real-time group collaboration workspace enabling instant messaging between logged-in project members. The feature uses low-latency web sockets to establish direct channels, broadcast events, and record messages dynamically in a persistent datastore.

- **Status:** **Implemented** (Bi-directional real-time communication & database persistence)

---

## 2. What I Learned
- **WebSocket Protocol:** Upgrading HTTP connections into persistent bi-directional communication ports.
- **Socket.io Framework:** Emitting custom structured events and handling cross-origin requests.
- **Event Listeners in React Hook Contexts:** Binding listeners on mount and performing cleanups on unmount to avoid memory leaks.
- **MongoDB Schema-Backed Message Storage:** Capturing dynamic events and writing them directly into document collections.

---

## 3. How It Was Used In This Project
The chat system connects users in real time.
- **File References:**
  - Client component: `frontend/src/components/ChatComponents/Chat.jsx`
  - Backend Entry/Sockets setup: `backend/server.js`
  - Backend Message Model: `backend/Models/Message.js`
  - Backend Message Controller: `backend/controller/messageControllerss.js`

### Network & Persistence Architecture Flow
1. The frontend initiates a connection using `const socket = io('http://localhost:8000')`.
2. When the user types and hits "Send", `socket.emit('sendMessage', { content, sender })` is dispatched.
3. The backend catches the `'sendMessage'` event inside `server.js`:
   ```javascript
   socket.on("sendMessage", async (data) => {
       await saveMessage(data.content, data.sender); // MongoDB write
       io.emit("receiveMessage", data);               // Real-time broadcast
   });
   ```
4. All connected users receive the `'receiveMessage'` event via websocket push and append the new message object to their state.

---

## 4. Project Architecture Notes
- **Context Integration:** The chat component reads `User` directly from `LoginContext` to populate the `sender` attribute dynamically.
- **Cleanup Management:**
  ```javascript
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off('receiveMessage'); // Prevents duplicate listeners
    };
  }, []);
  ```

---

## 5. Important Code Flow (Interview Preparation)
1. **Connection Established:** Client opens websocket socket connection to `http://localhost:8000`.
2. **User Submits Text:** User clicks send button. Form onSubmit triggers `sendMessage()`.
3. **Emit Message:** Frontend dispatches `socket.emit('sendMessage', { content: "Hello", sender: "Nitin" })`.
4. **Backend Ingestion:** Backend grabs message content and writes a record in MongoDB (`Message` collection).
5. **Re-broadcasting:** Backend issues `io.emit('receiveMessage', data)` to all connected sockets.
6. **Frontend Update:** Frontend handles event via `socket.on('receiveMessage')`, appends the message object to array, and re-renders the layout instantaneously.

---

## 6. Future Backend & Production Improvements
- **Initial Message Loading:** Integrate a REST API fetch route (`GET /messages`) on component mount so that previous conversation logs are loaded instead of starting with an empty screen.
- **Room Subscriptions:** Implement `socket.join(room)` so developers can chat inside specific projects instead of a single global group.
- **Typing Indicators:** Broadcast `"typing"` events from the client on input focus to show active team activity.
- **Connection Recovery:** Implement `socket.io` fallback states and auto-reconnect configurations for unstable mobile network states.
