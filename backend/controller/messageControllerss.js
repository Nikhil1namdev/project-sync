import Message from "../models/Message.js";

 const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
};

 const saveMessage = async (content, sender = "Anonymous") => {
  try {
    const newMessage = new Message({ content, sender });
    await newMessage.save();
  } catch (error) {
    console.error("Error saving message:", error);
  }
};
export  {getAllMessages,saveMessage};