import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";                    // <-- for creating server
import { Server } from "socket.io";         // <-- for socket.io
import ConnectDB from "./config/ConnectDB.js";
import ListFeatureRoutes from './Routes/ListFeatureRoutes.js';
import AuthRoutes from './Routes/AuthRoutes.js';
import { saveMessage } from "./controller/messageControllerss.js";
import MessageRoutes from './Routes/MessageRoutes.js';
dotenv.config();
ConnectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/List", ListFeatureRoutes);
app.use("/auth", AuthRoutes);
app.use("/messages", MessageRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the Atlassian Backend!");
});

// SOCKET.IO INTEGRATION
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // your frontend origin
    methods: ["GET", "POST"]
  }
});

// Socket events

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("sendMessage", async (data) => {
  console.log("Message Received:", data); // { content, sender }

  await saveMessage(data.content, data.sender);
  io.emit("receiveMessage", data); // rebroadcast full object
});

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
