import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, ChevronLeft, MessageSquare, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { ChatHistory as ChatHistoryType, RecommendationResult } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  chatMessages: Array<{ role: string; content: string }>;
  chatInput: string;
  chatLoading: boolean;
  selectedChatId: string | null;
  chatHistory: ChatHistoryType[];
  onChatInputChange: (value: string) => void;
  onChatSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onNewAnalysis: () => void;
  previousChatId?: string | null;
  recommendation?: RecommendationResult | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMessages,
  chatInput,
  chatLoading,
  selectedChatId,
  chatHistory,
  onChatInputChange,
  onChatSubmit,
  onBack,
  onNewAnalysis,
  previousChatId,
  recommendation,
}) => {
  const currentChat = chatHistory.find(chat => chat._id === selectedChatId);
  const chatTitle = currentChat?.websiteUrl || 'AI Assistant';
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isInitialLoad = React.useRef(true);

  // Scroll to bottom only for new messages, not when loading history
  React.useEffect(() => {
    if (!isInitialLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    isInitialLoad.current = false;
  }, [chatMessages]);

  const formatAIResponse = (content: string) => {
    // Try to parse the content as JSON first
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        // Check if this is a tech stack response (has frontend/backend/etc.)
        const isTechStackResponse = Object.keys(parsed).some(key => 
          ['frontend', 'backend', 'database', 'hosting', 'other'].includes(key.toLowerCase())
        );

        if (isTechStackResponse) {
          return (
            <div className="space-y-4">
              {Object.entries(parsed).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-lg font-bold mb-3 text-slate-800 dark:text-white capitalize">{key}</h4>
                  <div className="space-y-3">
                    {value.problems && value.problems.length > 0 && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {value.problems.map((problem: string, i: number) => (
                          <div key={i} className="mb-1">• {problem}</div>
                        ))}
                      </div>
                    )}
                    
                    {value.reason && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {value.reason}
                      </div>
                    )}

                    {value.stack && value.stack.length > 0 && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {value.stack.map((item: string, i: number) => (
                          <div key={i} className="mb-1">• {item}</div>
                        ))}
                      </div>
                    )}

                    {value.estimated_improvement && (
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Estimated Improvement: {value.estimated_improvement}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }
      }
    } catch (e) {
      // Not JSON, try to parse as structured text
      const sections = ['Frontend:', 'Backend:', 'Database:', 'Hosting:', 'Other:'];
      const structuredData: { [key: string]: { suggestions: string[] } } = {};
      
      let currentSection = '';
      let currentContent: string[] = [];
      let hasStructuredContent = false;

      // Split content into lines and process
      content.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Check if line is a section header
        const sectionMatch = sections.find(section => trimmedLine.startsWith(section));
        if (sectionMatch) {
          hasStructuredContent = true;
          // Save previous section if exists
          if (currentSection) {
            structuredData[currentSection.toLowerCase().replace(':', '')] = {
              suggestions: currentContent
            };
          }
          // Start new section
          currentSection = sectionMatch;
          currentContent = [];
        } else if (currentSection) {
          // Add content to current section
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
            currentContent.push(trimmedLine.substring(1).trim());
          } else {
            currentContent.push(trimmedLine);
          }
        }
      });

      // Save last section
      if (currentSection) {
        structuredData[currentSection.toLowerCase().replace(':', '')] = {
          suggestions: currentContent
        };
      }

      // If we found structured sections, render them as cards
      if (hasStructuredContent && Object.keys(structuredData).length > 0) {
        return (
          <div className="space-y-4">
            {Object.entries(structuredData).map(([key, value]) => (
              <div key={key} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-bold mb-3 text-slate-800 dark:text-white capitalize">{key}</h4>
                <div className="space-y-3">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {value.suggestions.map((suggestion, i) => (
                      <div key={i} className="mb-1">• {suggestion}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }
    }

    // If not structured text, format as markdown
    return (
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-bold mb-2 text-slate-800 dark:text-white">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="mb-1">{children}</li>
            ),
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const handleNewAnalysis = () => {
    onNewAnalysis();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChatSubmit(e);
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>{chatTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">AI Assistant - Ask About Your Analysis</p>
            </div>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleNewAnalysis}
          >
            New Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[600px]">
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
            {!selectedChatId && chatMessages.length === 0 && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>I've analyzed your website and here are my recommendations. Feel free to ask me any questions about them!</p>
                  </div>
                </div>
              </motion.div>
            )}
            {chatMessages.map((msg, index) => (
              <motion.div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white'
                  }`}
                >
                  {msg.role === 'assistant' ? formatAIResponse(msg.content) : msg.content}
                </div>
              </motion.div>
            ))}
            {/* Loading indicator */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat input area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                placeholder="Ask a question about your tech stack analysis..."
                value={chatInput}
                onChange={(e) => onChatInputChange(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit"
                disabled={chatLoading || !chatInput.trim()} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {chatLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  'Send'
                )}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 