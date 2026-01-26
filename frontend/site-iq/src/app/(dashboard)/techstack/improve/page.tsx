'use client';
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft } from "lucide-react";
import { MetaInfo } from "./components/MetaInfo";
import { TechStackItem } from "./components/TechStackItem";
import { ChatHistory } from "./components/ChatHistory";
import { ChatInterface } from "./components/ChatInterface";
import { AnalysisForm } from "./components/AnalysisForm";
import { useChat } from "./hooks/useChat";
import { useAnalysis } from "./hooks/useAnalysis";
import { useNavigation } from "./hooks/useNavigation";

export default function Improve() {
  const {
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
  } = useChat();

  const {
    formData,
    loading,
    recommendation,
    error,
    isUrlValid,
    isCheckingUrl,
    urlWarning,
    conversationId,
    showMetaInfo,
    setRecommendation,
    setShowMetaInfo,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit
  } = useAnalysis();

  const {
    showSidebar,
    cameFromAnalysis,
    previousState,
    setShowSidebar,
    setCameFromAnalysis,
    setPreviousState,
    handleBack,
    handleForward,
    handleNewAnalysis
  } = useNavigation();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadChatHistory();
    }
  }, [conversationId]);

  const handleStartChat = () => {
    if (!conversationId || !recommendation) return;

    // Store the current state before switching to chat
    setPreviousState({
      type: 'analysis',
      recommendation: recommendation,
      chatId: selectedChatId,
      chatMessages: chatMessages
    });

    setShowChat(true);
    setSelectedChatId(conversationId);
    
    // If we have previous chat messages, restore them
    if (chatMessages.length > 0) {
      // Keep existing messages
      setChatMessages(chatMessages);
    } else {
      // Initialize with new message
      const initialMessages = [
        { 
          role: "assistant", 
          content: `I've analyzed your website and have some recommendations. Here's a summary of what I found:

${recommendation.meta.description}

You can ask me any questions about the analysis or specific recommendations.`
        }
      ];
      setChatMessages(initialMessages);
    }
    
    setCameFromAnalysis(true);
  };

  const handleBackToPrevious = () => {
    if (previousChatId) {
      setShowChat(true);
      setSelectedChatId(previousChatId);
      handleChatSelect(previousChatId);
      setCameFromAnalysis(false);
    }
  };

  const handleBackClick = () => {
    if (showChat) {
      setPreviousState({
        type: 'chat',
        chatId: selectedChatId,
        chatMessages: chatMessages
      });
      setShowChat(false);
      handleBack(showChat, recommendation);
    } else if (recommendation) {
      setPreviousState({
        type: 'analysis',
        recommendation: recommendation
      });
      setRecommendation(null);
      handleBack(showChat, recommendation);
    }
  };

  const handleNewAnalysisClick = () => {
    setShowChat(false);
    setSelectedChatId(null);
    setChatMessages([]);
    setRecommendation(null);
    setShowMetaInfo(false);
    setCameFromAnalysis(false);
    setPreviousState(null);
    setShowSidebar(false);
  };

  return (
    <div className="container mx-auto px-4 relative bg-white dark:bg-slate-900">
      <div className="flex">
        <ChatHistory
          showSidebar={showSidebar}
          chatHistory={chatHistory}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onDeleteChat={handleDeleteChat}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
        
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-[320px]' : 'ml-0'}`}>
          <motion.div 
            className="max-w-5xl mx-auto pb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Improve Your Tech Stack
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Get personalized recommendations to optimize your website's technology stack and improve performance.
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              {showChat ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    
                  <ChatInterface
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    chatLoading={chatLoading}
                    selectedChatId={selectedChatId}
                    chatHistory={chatHistory}
                      onChatInputChange={setChatInput}
                      onChatSubmit={(e) => handleChatSubmit(e, selectedChatId)}
                      onBack={handleBackClick}
                      onNewAnalysis={handleNewAnalysisClick}
                      previousChatId={previousChatId}
                      recommendation={recommendation}
                    />
                  </div>
                </motion.div>
              ) : !recommendation ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute -top-12 left-0">
                      {cameFromAnalysis && previousChatId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToPrevious}
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Back to Previous Analysis
                        </Button>
                      )}
                    </div>
                  <AnalysisForm
                    formData={formData}
                    loading={loading}
                    error={error}
                      urlWarning={urlWarning}
                      isUrlValid={isUrlValid}
                      isCheckingUrl={isCheckingUrl}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    onSubmit={handleSubmit}
                  />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleBackClick}
                          className="mr-4 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tech Stack Analysis</h2>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={handleNewAnalysisClick}
                        className="cursor-pointer"
                      >
                        New Analysis
                      </Button>
                    </div>

                    {showMetaInfo && <MetaInfo meta={recommendation.meta} />}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <TechStackItem tech={recommendation.frontend} title="Frontend" index={0} />
                      <TechStackItem tech={recommendation.backend} title="Backend" index={1} />
                      <TechStackItem tech={recommendation.database} title="Database" index={2} />
                      <TechStackItem tech={recommendation.hosting} title="Hosting" index={3} />
                      <TechStackItem tech={recommendation.other} title="Other" index={4} />
                    </div>

                    <motion.div
                      className="mt-8 flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer"
                        size="lg"
                        onClick={handleStartChat}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ask Questions About This Analysis
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}