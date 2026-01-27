// controllers/techstackChatController.js
import dotenv from "dotenv";
import Conversation from "../models/techstackChatModel.js";
import { callOpenAI } from "../utils/openaiClient.js";

dotenv.config();

// Handle the improvement response for a conversation
export async function handleImproveChat(req, res) {
  const { message, conversationId } = req.body;
  const clerkUserId = req.auth?.userId; // Extracting user ID from authenticated user (from the middleware)

  if (!message || !clerkUserId) {
    // Return error if message or userId is missing
    return res.status(400).json({ error: "Missing required fields or unauthenticated" });
  }

  try {
    // Find the conversation by ID and user ID (ensure the conversation belongs to the correct user)
    let conversation = await Conversation.findOne({ _id: conversationId, clerkUserId });
    if (!conversation) {
      // If conversation not found, return an error
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Context for the AI to understand the improvement request
    const contextPrompt = `
      You are a technical assistant helping the user based on the following improvement analysis response:
      ${conversation.improvementResponse}

      The user now asks:
      ${message}
    `;

    // Combine the conversation's history with the new message
    const messages = [
      { role: "system", content: contextPrompt },
      ...conversation.history,
      { role: "user", content: message }
    ];

    // Send the request to OpenAI for generating a response
    const aiReply = await callOpenAI(messages, { max_tokens: 800 });

    // Update conversation history with user and assistant messages
    conversation.history.push({ role: "user", content: message });
    conversation.history.push({ role: "assistant", content: aiReply });
    conversation.lastUpdated = new Date(); // Set the last updated timestamp

    // Save the updated conversation in the database
    await conversation.save();

    // Return the AI's reply and conversationId
    res.json({
      reply: aiReply,
      conversationId: conversation._id
    });
  } catch (error) {
    // Handle error (log it and return a message)
    console.error("AI chat error:", error?.message);
    res.status(500).json({ error: "AI chat failed" });
  }
}

// Get all messages in a conversation by its ID
export async function getMessagesByConversation(req, res) {
  const { conversationId } = req.params;

  try {
    // Find the conversation by ID and get its messages, sorted by creation date
    const conversation = await Conversation.findOne({ _id: conversationId });
    if (!conversation) {
      // If no conversation found, return error
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Return the messages as part of the response
    res.json({ messages: conversation.history });
  } catch (error) {
    // Handle errors that may occur while fetching the messages
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
}
