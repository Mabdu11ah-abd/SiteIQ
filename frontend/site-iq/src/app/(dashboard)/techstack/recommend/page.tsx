'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader, Check, X, Code, Database, Server, Globe, Wrench, ArrowLeft, ArrowRight } from "lucide-react";
import { recommendTechStack } from "@/lib/api";

interface TechStack {
  stack: string[];
  reason: string;
}

interface RecommendationResult {
  frontend: TechStack;
  backend: TechStack;
  database: TechStack;
  hosting: TechStack;
  other: TechStack;
}

export default function Recommend() {
  const [formData, setFormData] = useState({
    useCase: "",
    seoFocused: false,
    performanceFocused: false,
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [previousRecommendation, setPreviousRecommendation] = useState<RecommendationResult | null>(null);
  const [isViewingPrevious, setIsViewingPrevious] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.useCase) {
      setError("Please describe your business use case");
      return;
    }

    setLoading(true);
    
    try {
      const requestData = {
        useCase: formData.useCase,
        seoFocused: formData.seoFocused,
        performanceFocused: formData.performanceFocused
      };
      
      const response = await recommendTechStack(requestData);
      const data = response.recommendation;
      
      // Store current recommendation as previous before setting new one
      if (recommendation) {
        setPreviousRecommendation(recommendation);
      }
      setRecommendation(data);
      setIsViewingPrevious(false);
    } catch (err) {
      console.error("Error getting recommendation:", err);
      setError("Failed to get recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    // Store current recommendation as previous before clearing
    if (recommendation) {
      setPreviousRecommendation(recommendation);
    }
    setRecommendation(null);
    setIsViewingPrevious(false);
    setFormData({
      useCase: "",
      seoFocused: false,
      performanceFocused: false,
    });
  };

  const handleViewPrevious = () => {
    if (previousRecommendation) {
      // Store current recommendation temporarily
      const currentRec = recommendation;
      // Show previous recommendation
      setRecommendation(previousRecommendation);
      // Store current recommendation as previous
      setPreviousRecommendation(currentRec);
      setIsViewingPrevious(true);
    }
  };

  const handleViewLatest = () => {
    if (previousRecommendation) {
      // Store current recommendation temporarily
      const currentRec = recommendation;
      // Show previous recommendation (which is actually the latest)
      setRecommendation(previousRecommendation);
      // Store current recommendation as previous
      setPreviousRecommendation(currentRec);
      setIsViewingPrevious(false);
    }
  };

  const renderTechItem = (tech: TechStack, title: string, index: number, delay: number = 0) => {
    if (!tech || !tech.reason) {
      return null;
    }

    const getIcon = (title: string) => {
      switch (title.toLowerCase()) {
        case 'frontend':
          return <Code className="h-6 w-6" />;
        case 'backend':
          return <Server className="h-6 w-6" />;
        case 'database':
          return <Database className="h-6 w-6" />;
        case 'hosting':
          return <Globe className="h-6 w-6" />;
        case 'other':
          return <Wrench className="h-6 w-6" />;
        default:
          return <Code className="h-6 w-6" />;
      }
    };

    return (
      <motion.div
        key={title}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + (index * 0.1) }}
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4 shadow-md">
            {getIcon(title)}
          </div>
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h4>
        </div>

        <div className="mb-6">
          <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">Analysis</h5>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tech.reason}</p>
        </div>
        
        {tech.stack && tech.stack.length > 0 && (
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">Recommended Technologies</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tech.stack.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: delay + (i * 0.1) }}
                    className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                  >
                    <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-white dark:bg-slate-900 min-h-screen">
      <motion.div 
        className="max-w-5xl mx-auto"
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
            Tech Stack Recommendations
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Get personalized technology recommendations based on your business needs and priorities.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!recommendation ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Tell Us About Your Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="useCase">Business Type and Use Case in detail</Label>
                      <Textarea
                        id="useCase"
                        name="useCase"
                        placeholder="e.g., E-commerce website for selling handmade crafts, requiring inventory management and secure payment processing..."
                        value={formData.useCase}
                        onChange={handleInputChange}
                        required
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Priorities</Label>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="seoFocused"
                            checked={formData.seoFocused}
                            onCheckedChange={(checked) => handleCheckboxChange("seoFocused", checked as boolean)}
                          />
                          <Label htmlFor="seoFocused" className="text-sm font-normal">
                            SEO Optimization
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="performanceFocused"
                            checked={formData.performanceFocused}
                            onCheckedChange={(checked) => handleCheckboxChange("performanceFocused", checked as boolean)}
                          />
                          <Label htmlFor="performanceFocused" className="text-sm font-normal">
                            Performance Optimization
                          </Label>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}

                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Generating Recommendations...
                        </>
                      ) : (
                        <>Get Recommendations</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
              <Card>
                <CardHeader className="pb-0">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={handleStartOver}
                        className="cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <CardTitle className="text-2xl">Your Personalized Tech Stack</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {previousRecommendation && (
                        <>
                          {isViewingPrevious ? (
                            <Button 
                              variant="outline"
                              onClick={handleViewLatest}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <ArrowRight className="h-4 w-4" />
                              Latest Recommendation
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              onClick={handleViewPrevious}
                              className="cursor-pointer"
                            >
                              View Previous Recommendation
                            </Button>
                          )}
                        </>
                      )}
                      <Button 
                        variant="outline"
                        onClick={handleStartOver}
                        className="cursor-pointer"
                      >
                        Start Over
                      </Button>
                    </div>
                  </motion.div>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8"
                  >
                    <h3 className="font-medium text-lg mb-2 text-blue-700 dark:text-blue-400">Summary</h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      Based on your requirements for {formData.useCase}, we've analyzed and recommended the following technology stack.
                      {formData.seoFocused && " SEO optimization has been prioritized."}
                      {formData.performanceFocused && " Performance optimization has been prioritized."}
                    </p>
                  </motion.div>

                  <div className="space-y-12">
                    {recommendation.frontend && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {renderTechItem(recommendation.frontend, "Frontend Technologies", 0, 0.4)}
                      </motion.section>
                    )}

                    {recommendation.backend && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {renderTechItem(recommendation.backend, "Backend Technologies", 1, 0.6)}
                      </motion.section>
                    )}

                    {recommendation.database && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        {renderTechItem(recommendation.database, "Database Solutions", 2, 0.8)}
                      </motion.section>
                    )}

                    {recommendation.hosting && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        {renderTechItem(recommendation.hosting, "Hosting & Infrastructure", 3, 1.0)}
                      </motion.section>
                    )}

                    {recommendation.other && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        {renderTechItem(recommendation.other, "Additional Tools", 4, 1.2)}
                      </motion.section>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
