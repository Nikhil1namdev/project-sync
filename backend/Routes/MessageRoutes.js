import express from "express";
import { getAllMessages } from "../controller/messageControllerss.js";

const router = express.Router();

router.get("/", getAllMessages);

export default router;
