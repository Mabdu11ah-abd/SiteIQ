"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, CheckCircle, AlertCircle, Smartphone, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DemoSection() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("desktop");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url) {
      setError("Please enter a website URL");
      return;
    }

    // Simple URL validation
    if (!url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setStep(1);
    // Simulate analysis process
    setTimeout(() => setStep(2), 2000);
  };

  const steps = [
    {
      title: "Enter your website URL",
      description: "Provide your website address to begin the SEO analysis process.",
    },
    {
      title: "AI-powered analysis",
      description: "Our system analyzes your website using multiple APIs and advanced algorithms.",
    },
    {
      title: "Get actionable recommendations",
      description: "Receive personalized recommendations to improve your website's SEO performance.",
    },
  ];

  const criticalIssues = [
    {
      title: "Slow Page Load Time",
      description: "Your homepage takes 5.2s to load on mobile devices, which is significantly higher than the recommended 2s threshold.",
      solution: "Optimize images, enable browser caching, and minify CSS/JavaScript files.",
      severity: "high",
    },
    {
      title: "Missing Meta Descriptions",
      description: "18 pages on your website are missing meta descriptions, which hurts your search visibility.",
      solution: "Add unique and compelling meta descriptions to each page (under 160 characters).",
      severity: "medium",
    },
    {
      title: "Mobile Usability Issues",
      description: "Text is too small to read on mobile devices and clickable elements are too close together.",
      solution: "Implement responsive design principles and increase tap target sizes to at least 44x44px.",
      severity: "high",
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600">
            See How SiteIQ Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Experience the power of AI-driven SEO analysis in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex mb-8 justify-center md:justify-start">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full 
                      ${
                        step >= i
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      step === i
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(79, 70, 229, 0.4)",
                              "0 0 0 10px rgba(79, 70, 229, 0)",
                              "0 0 0 0 rgba(79, 70, 229, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: step === i ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    {step > i ? <CheckCircle className="h-5 w-5" /> : i + 1}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div
                      className={`w-12 h-1 ${step > i ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-slate-200 dark:bg-slate-700"}`}
                      animate={step === i ? { opacity: [0.5, 1, 0.5] } : {}}
                      transition={{ duration: 1.5, repeat: step === i ? Number.POSITIVE_INFINITY : 0 }}
                    ></motion.div>
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-semibold mb-2">{steps[step].title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{steps[step].description}</p>

                {step === 0 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="pl-10 pr-4 py-2 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>

                    {error && (
                      <motion.div
                        className="flex items-center text-red-500 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-glow"
                    >
                      Analyze
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}

                {step === 1 && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-4">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      ></motion.div>

                      <motion.div
                        className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      ></motion.div>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Analyzing {url}...</p>
                    <div className="mt-2 text-sm text-slate-500">This usually takes a few seconds</div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <motion.div
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <div className="flex items-center text-green-700 dark:text-green-400 font-medium">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Analysis complete!
                      </div>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div 
                        className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-200">SEO Score</h4>
                        <div className="mt-2 flex items-center">
                          <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-yellow-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "78%" }}
                              transition={{ duration: 1, delay: 0.2 }}
                            ></motion.div>
                          </div>
                          <span className="ml-2 font-bold text-yellow-600 dark:text-yellow-400">78/100</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-200">Performance</h4>
                        <div className="mt-2 flex items-center">
                          <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "92%" }}
                              transition={{ duration: 1, delay: 0.3 }}
                            ></motion.div>
                          </div>
                          <span className="ml-2 font-bold text-green-600 dark:text-green-500">92/100</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-200">Accessibility</h4>
                        <div className="mt-2 flex items-center">
                          <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 1, delay: 0.4 }}
                            ></motion.div>
                          </div>
                          <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">85/100</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-200">Best Practices</h4>
                        <div className="mt-2 flex items-center">
                          <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-purple-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "71%" }}
                              transition={{ duration: 1, delay: 0.5 }}
                            ></motion.div>
                          </div>
                          <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">71/100</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      className="p-5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="text-xl font-semibold mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Critical Issues
                      </h4>
                      
                      <div className="space-y-4">
                        {criticalIssues.map((issue, i) => (
                          <motion.div
                            key={i}
                            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + (i * 0.1) }}
                          >
                            <div className="flex items-start">
                              <div className={`mt-1 w-3 h-3 rounded-full ${
                                issue.severity === 'high' ? 'bg-red-500' : 
                                issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                              } mr-2`}></div>
                              <div>
                                <h5 className="font-medium">{issue.title}</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{issue.description}</p>
                                <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border-l-2 border-green-500 text-sm">
                                  <span className="font-medium text-green-600 dark:text-green-400">Solution:</span> {issue.solution}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <Button
                      onClick={() => setStep(0)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-glow"
                    >
                      Try another URL
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Device preview controls */}
            {step === 2 && (
              <motion.div 
                className="mb-4 flex justify-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-full shadow-md p-1 flex">
                  <button 
                    className={`flex items-center px-3 py-1 rounded-full ${activeView === 'desktop' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}`}
                    onClick={() => setActiveView('desktop')}
                  >
                    <Monitor className="h-4 w-4 mr-1" />
                    Desktop
                  </button>
                  <button 
                    className={`flex items-center px-3 py-1 rounded-full ${activeView === 'mobile' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}`}
                    onClick={() => setActiveView('mobile')}
                  >
                    <Smartphone className="h-4 w-4 mr-1" />
                    Mobile
                  </button>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              {activeView === 'desktop' && (
                <motion.div 
                  key="desktop"
                  className="relative mx-auto w-[600px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative bg-slate-800 rounded-t-xl p-2 shadow-2xl">
                    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div className="mb-4 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700 rounded"></div>
                      </div>
                      <div className="p-4">
                        <AnimatePresence mode="wait">
                          {step === 0 && (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-4/6"></div>
                              </div>
                            </motion.div>
                          )}

                          {step === 1 && (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-4/6 animate-pulse"></div>
                              </div>
                            </motion.div>
                          )}

                          {step === 2 && (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.div
                                className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white flex items-center justify-center font-medium"
                                initial={{ y: -10 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                {url || "yourwebsite.com"}
                              </motion.div>
                              <div className="grid grid-cols-3 gap-4">
                                <motion.div
                                  className="col-span-2 h-40 bg-slate-100 dark:bg-slate-700 rounded"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                ></motion.div>
                                <div className="space-y-2">
                                  <motion.div
                                    className="h-12 bg-slate-100 dark:bg-slate-700 rounded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                  ></motion.div>
                                  <motion.div
                                    className="h-12 bg-slate-100 dark:bg-slate-700 rounded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                  ></motion.div>
                                  <motion.div
                                    className="h-12 bg-slate-100 dark:bg-slate-700 rounded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                  ></motion.div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-b-xl shadow-2xl">
                    <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto"></div>
                  </div>
                </motion.div>
              )}
              
              {activeView === 'mobile' && (
                <motion.div
                  key="mobile"
                  className="relative mx-auto w-[280px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative bg-slate-800 rounded-[2rem] p-2 shadow-2xl">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10"></div>
                    <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div className="h-6 flex items-center justify-center">
                        <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                      <div className="p-3">
                        <AnimatePresence mode="wait">
                          {step === 0 && (
                            <motion.div
                              className="space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                              <div className="space-y-1">
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-4/6"></div>
                              </div>
                            </motion.div>
                          )}

                          {step === 1 && (
                            <motion.div
                              className="space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                              <div className="space-y-3">
                                <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                              </div>
                              <div className="space-y-1">
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-5/6 animate-pulse"></div>
                              </div>
                            </motion.div>
                          )}

                          {step === 2 && (
                            <motion.div
                              className="space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.div
                                className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white flex items-center justify-center text-xs font-medium"
                                initial={{ y: -5 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                {url || "yourwebsite.com"}
                              </motion.div>
                              <div className="space-y-2">
                                <motion.div
                                  className="h-28 bg-slate-100 dark:bg-slate-700 rounded"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                ></motion.div>
                                <div className="space-y-2">
                                  <motion.div
                                    className="h-8 bg-slate-100 dark:bg-slate-700 rounded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                  ></motion.div>
                                  <motion.div
                                    className="h-8 bg-slate-100 dark:bg-slate-700 rounded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                  ></motion.div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
