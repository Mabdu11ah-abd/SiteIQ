//TECHSTACK CHAT CONTROLLER
// This controller handles user chat functionalities such as fetching and deleting user chats.
// controllers/userChatController.js
import Conversation from "../models/techstackChatModel.js"; // ✅ Updated model name

export async function getUserChats(req, res) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chats = await Conversation.find({ clerkUserId: userId }).sort({ lastUpdated: -1 });
    if (!chats.length) {
      return res.status(404).json({ message: "No conversations found" });
    }

    res.json({ chats });
  } catch (err) {
    console.error("Fetch chats error:", err.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
}

export async function deleteUserChat(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await Conversation.deleteOne({ _id: id, clerkUserId: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete chat error:", err.message);
    res.status(500).json({ error: "Failed to delete chat" });
  }
}

// Fetch a single conversation with all messages
export async function getChatHistory(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chat = await Conversation.findOne({ _id: id, clerkUserId: userId });
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ chat });
  } catch (err) {
    console.error("Fetch chat history error:", err.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
}

// Add a new message to an existing conversation
export async function addMessageToChat(req, res) {
  const { id } = req.params;
  const userId = req.userId;
  const { message } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chat = await Conversation.findOneAndUpdate(
      { _id: id, clerkUserId: userId },
      {
        $push: { messages: message },
        $set: { lastUpdated: new Date() }
      },
      { new: true }
    );
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ chat });
  } catch (err) {
    console.error("Add message error:", err.message);
    res.status(500).json({ error: "Failed to add message" });
  }
}
