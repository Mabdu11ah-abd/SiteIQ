'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Check, AlertCircle, Smartphone, Monitor } from "lucide-react";

const UrlAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulate results
      setResults({
        url,
        scores: {
          performance: 78,
          seo: 92,
          accessibility: 86,
          bestPractices: 73
        },
        criticalIssues: [
          {
            type: "Performance",
            issue: "Large images are not optimized",
            solution: "Compress images and use next-gen formats like WebP"
          },
          {
            type: "SEO",
            issue: "Missing meta descriptions on 3 pages",
            solution: "Add descriptive meta tags to all pages"
          },
          {
            type: "Accessibility",
            issue: "Low contrast text in navigation",
            solution: "Increase contrast ratio to at least 4.5:1"
          }
        ]
      });
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <section id="analyze" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Analyze Your Website <span className="gradient-text">Instantly</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Enter your website URL to get a comprehensive SEO analysis and AI-powered recommendations.
            </motion.p>
          </motion.div>

          <motion.div 
            className="glass-card p-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-12 gradient-bg"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Now"
                )}
              </Button>
            </form>
          </motion.div>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-center">Results for <span className="gradient-text">{results.url}</span></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <motion.div 
                    className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow border border-gray-200 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h4 className="text-sm text-gray-500 mb-1">Performance</h4>
                    <p className={`text-3xl font-bold ${getScoreColor(results.scores.performance)}`}>{results.scores.performance}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow border border-gray-200 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h4 className="text-sm text-gray-500 mb-1">SEO</h4>
                    <p className={`text-3xl font-bold ${getScoreColor(results.scores.seo)}`}>{results.scores.seo}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow border border-gray-200 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <h4 className="text-sm text-gray-500 mb-1">Accessibility</h4>
                    <p className={`text-3xl font-bold ${getScoreColor(results.scores.accessibility)}`}>{results.scores.accessibility}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg shadow border border-gray-200 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <h4 className="text-sm text-gray-500 mb-1">Best Practices</h4>
                    <p className={`text-3xl font-bold ${getScoreColor(results.scores.bestPractices)}`}>{results.scores.bestPractices}</p>
                  </motion.div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-3">Critical Issues & Solutions</h4>
                  <div className="space-y-4">
                    {results.criticalIssues.map((issue: any, index: number) => (
                      <motion.div 
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                      >
                        <div className="flex items-start">
                          <div className="mr-3">
                            <AlertCircle className="text-red-500 h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{issue.type}: {issue.issue}</p>
                            <div className="mt-2 flex items-start">
                              <div className="mr-2">
                                <Check className="text-green-500 h-4 w-4" />
                              </div>
                              <p className="text-sm text-gray-600">Solution: {issue.solution}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold mb-4">Website Preview</h4>
                <div className="flex justify-center mb-4">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium flex items-center ${
                        activeView === "desktop" 
                          ? "bg-primary text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } border border-gray-200 rounded-l-lg`}
                      onClick={() => setActiveView("desktop")}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Desktop
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium flex items-center ${
                        activeView === "mobile" 
                          ? "bg-primary text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } border border-gray-200 rounded-r-lg`}
                      onClick={() => setActiveView("mobile")}
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      Mobile
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {activeView === "desktop" ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full max-w-3xl aspect-[16/9] bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center px-4">
                        <div className="flex space-x-2 mr-4">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="bg-white px-2 py-1 rounded text-xs text-gray-500 border border-gray-300 flex-1 text-center overflow-hidden text-ellipsis">
                          {results.url}
                        </div>
                      </div>
                      <iframe 
                        src={results.url} 
                        className="w-full h-[calc(100%-32px)]" 
                        title="Desktop preview" 
                        sandbox="allow-same-origin"
                      ></iframe>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-[375px] h-[667px] bg-black rounded-[40px] p-3 shadow-xl border-4 border-gray-800"
                    >
                      <div className="w-full h-full bg-white rounded-[28px] overflow-hidden">
                        <div className="h-6 bg-gray-800 flex justify-center items-center">
                          <div className="w-20 h-4 bg-black rounded-b-lg"></div>
                        </div>
                        <iframe 
                          src={results.url} 
                          className="w-full h-[calc(100%-24px)]" 
                          title="Mobile preview" 
                          sandbox="allow-same-origin"
                        ></iframe>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enter URL</h3>
              <p className="text-gray-600">
                Input your website URL and let our system crawl and analyze your site.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Analysis</h3>
              <p className="text-gray-600">
                Review the comprehensive SEO report generated by our advanced tools.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 1.0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                Get personalized AI recommendations to improve your website's SEO performance.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrlAnalyzer;
