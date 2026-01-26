import { useState, useCallback, useEffect } from 'react';
import { sendChatMessage, getChatHistory, deleteChat, getChatMessages } from '@/lib/api';
import { ChatHistory as ChatHistoryType } from '../types';

export const useChat = () => {
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [previousChatId, setPreviousChatId] = useState<string | null>(null);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load chat messages when selectedChatId changes
  useEffect(() => {
    if (selectedChatId) {
      handleChatSelect(selectedChatId);
    }
  }, [selectedChatId]);

  const loadChatHistory = async () => {
    try {
      const response = await getChatHistory();
      if (response && response.chats && Array.isArray(response.chats)) {
        const formattedChats = response.chats.map(chat => ({
          ...chat,
          id: chat.id || chat._id,
          timestamp: chat.timestamp || chat.lastUpdated || chat.createdAt || new Date().toISOString()
        }));
        setChatHistory(formattedChats);
      } else {
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setChatHistory([]);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      setShowChat(true);
      setChatLoading(true);
      setSelectedChatId(chatId);
      setPreviousChatId(chatId);
      
      const response = await getChatMessages(chatId);
      
      if (!response || !response.chat) {
        setChatMessages([]);
        return;
      }

      const messages = response.chat.history || [];
      const formattedMessages = messages.map(msg => ({
        role: msg.role || (msg.isUser ? 'user' : 'assistant'),
        content: msg.content || msg.message || ''
      }));
      
      setChatMessages(formattedMessages);
      setShowChat(true);
    } catch (err) {
      console.error("Error loading chat messages:", err);
      setChatMessages([]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
      if (selectedChatId === chatId) {
        setChatMessages([]);
        setSelectedChatId(null);
        setShowChat(false);
      }
      await loadChatHistory();
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent, conversationId: string | null) => {
    e.preventDefault();
    if (!chatInput.trim() || !conversationId) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        conversationId
      });

      if (response && response.reply) {
        setChatMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
        await loadChatHistory();
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  return {
    chatMessages,
    chatInput,
    chatLoading,
    showChat,
    chatHistory,
    selectedChatId,
    previousChatId,
    setChatInput,
    setShowChat,
    setPreviousChatId,
    setSelectedChatId,
    setChatMessages,
    loadChatHistory,
    handleChatSelect,
    handleDeleteChat,
    handleChatSubmit
  };
};