// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4500/api",
  withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR - Automatically add JWT token from localStorage
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[API] Failed to get JWT token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


export async function recommendTechStack({ useCase, seoFocused, performanceFocused }) {
  try {
    // Ensure boolean values are properly converted
    const requestData = {
      useCase,
      seoFocused: Boolean(seoFocused),
      performanceFocused: Boolean(performanceFocused)
    };

    console.log('Sending request data:', requestData); // Debug log

    const response = await api.post("/techstack/recommend", requestData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error); // Debug log
    throw new Error(error.response?.data?.message || "Failed to fetch recommendation");
  }
}

export const improveTechStack = async ({ websiteUrl, useCase, seoFocused, performanceFocused }) => {
  try {
    console.log("Sending improve request with data:", {
      websiteUrl,
      useCase,
      seoFocused,
      performanceFocused
    });

    const requestData = {
      websiteUrl,
      useCase,
      seoFocused: Boolean(seoFocused),
      performanceFocused: Boolean(performanceFocused)
    };

    const response = await api.post("/techstack/improve", requestData);
    return response.data;
  } catch (error) {
    console.error("Improve Tech Stack API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const sendChatMessage = async ({ message, conversationId }) => {
  try {
    console.log("Sending chat message:", { message, conversationId });
    const response = await api.post("/techstackchat/chat", {
      message,
      conversationId,
    });
    return response.data;
  } catch (error) {
    console.error("Send Chat Message API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getChatHistory = async () => {
  try {
    console.log("Making API call to /userchat/chats...");
    const response = await api.get("/userchat/chats");
    console.log("API Response status:", response.status);
    console.log("API Response data:", response.data);
    
    if (!response.data) {
      console.log("No data received from API");
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.log("Get Chat History API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    console.log("Fetching messages for chat:", chatId);
    const response = await api.get(`/userchat/chats/${chatId}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data) {
      console.warn("No data received in response for chat:", chatId);
      return [];
    }
    
    console.log("Successfully fetched messages for chat:", chatId, response.data);
    return response.data;
  } catch (error) {
    console.log("Get Chat Messages API Error:", {
      chatId,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out while fetching chat messages');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Chat not found');
    }
    
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    console.log("Deleting chat with ID:", chatId);
    const response = await api.delete(`/userchat/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.log("Delete Chat API Error:", error);
    throw error;
  }
};


//stripe payment api call
const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL
export const createCheckoutSession = async (lookup_key, userId) => {
  if (!backendURL) {
    throw new Error('API base URL is not defined');
  }
  const res = await fetch(`${backendURL}/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lookup_key, userId })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create Stripe session');
  return data;
};