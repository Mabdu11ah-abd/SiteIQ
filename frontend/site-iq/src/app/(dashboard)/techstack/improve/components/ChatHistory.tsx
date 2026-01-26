import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatHistory as ChatHistoryType } from '../types';

interface ChatHistoryProps {
  showSidebar: boolean;
  chatHistory: ChatHistoryType[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onToggleSidebar: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  showSidebar,
  chatHistory,
  selectedChatId,
  onChatSelect,
  onDeleteChat,
  onToggleSidebar,
}) => {
  const handleChatSelect = (chatId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChatSelect(chatId);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-16 h-full w-[320px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto flex flex-col shadow-xl"
          >
            {/* Chat history header */}
            <div className="flex-none p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Chat History</h3>
            </div>
            
            {/* Chat history list */}
            <div className="flex-1 p-3 space-y-2">
              {!Array.isArray(chatHistory) || chatHistory.length === 0 ? (
                <div key="no-chats" className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No previous chats
                </div>
              ) : (
                chatHistory.map((chat) => {
                  if (!chat || !chat._id) {
                    console.warn("Attempting to render chat with invalid ID:", chat);
                    return null;
                  }
                  
                  const chatId = chat._id;
                  const timestamp = chat.timestamp || chat.lastUpdated || chat.createdAt;
                  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'No date';
                  
                  const fullTitle = chat.title || 'Untitled Chat';
                  const websiteName = fullTitle.split(' - ')[0] || fullTitle;
                  
                  return (
                    <div 
                      key={`chat-${chatId}`}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      onClick={handleChatSelect(chatId)}
                    >
                      {/* Chat icon and title */}
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div className="truncate">
                          {/* Title with tooltip */}
                          <div className="relative group/title">
                            <span className="text-sm font-medium block truncate text-slate-900 dark:text-slate-100" title={fullTitle}>
                              {websiteName}
                            </span>
                            <div className="absolute left-0 bottom-full mb-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                              {fullTitle}
                              <div className="absolute left-4 bottom-0 w-2 h-2 bg-slate-900 transform rotate-45 translate-y-1/2"></div>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteChat(chatId, e);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 flex-shrink-0 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle sidebar button */}
      <button
        onClick={onToggleSidebar}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 z-50 p-2 rounded-r-md shadow-md border border-l-0 border-slate-200 dark:border-slate-700"
      >
        {showSidebar ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </>
  );
}; 