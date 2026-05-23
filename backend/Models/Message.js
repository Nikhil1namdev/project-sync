import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: String, default: "Anonymous" }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
