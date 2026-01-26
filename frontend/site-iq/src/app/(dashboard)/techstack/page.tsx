'use client';
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Server, Database, Globe, Zap, Shield, BarChart } from "lucide-react";

const stats = [
  { label: "Websites Analyzed", value: "10K+" },
  { label: "Improvement Rate", value: "85%" },
  { label: "Client Satisfaction", value: "98%" },
  { label: "Performance Boost", value: "3x" }
];

const techStackFeatures = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "Frontend Analysis",
    description: "Evaluate your UI frameworks, performance, and user experience"
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Backend Optimization",
    description: "Analyze server architecture, APIs, and scalability"
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Database Solutions",
    description: "Optimize data storage, queries, and caching strategies"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Hosting & Infrastructure",
    description: "Evaluate deployment, scaling, and security measures"
  }
];

const improveFeatures = [
  {
    title: "Performance Analysis",
    description: "Deep dive into your website's performance metrics and identify optimization opportunities"
  },
  {
    title: "SEO Optimization",
    description: "Analyze and improve your search engine visibility and ranking factors"
  },
  {
    title: "Security Assessment",
    description: "Evaluate your security measures and get recommendations for improvements"
  },
  {
    title: "Code Quality",
    description: "Review code structure, best practices, and maintainability"
  }
];

const recommendFeatures = [
  {
    title: "Custom Solutions",
    description: "Get tailored recommendations based on your specific project requirements"
  },
  {
    title: "Cost Analysis",
    description: "Understand the cost implications of different technology choices"
  },
  {
    title: "Scalability Planning",
    description: "Ensure your tech stack can grow with your business needs"
  },
  {
    title: "Future-Proofing",
    description: "Choose technologies that will remain relevant and supported"
  }
];

export default function TechStackLanding() {
  return (
    <div className="container mx-auto px-4 py-12 bg-white dark:bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tech Stack Services
        </motion.h1>
        <motion.p 
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Optimize your website's technology stack with our AI-powered tech analysis 
          and recommendation tools. Choose the service that best fits your needs.
        </motion.p>

        {/* Animated Tech Stack Visualization */}
        <motion.div 
          className="flex justify-center items-center gap-4 mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {techStackFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                {feature.icon}
              </div>
              {index < techStackFeatures.length - 1 && (
                <motion.div
                  className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + (index * 0.1) }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value}</h3>
            <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="h-full overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 sticky top-0 z-10 m-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl font-extrabold tracking-tight text-blue-900 dark:text-blue-100 m-0">Tech Stack Improvement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 text-slate-600">
                <p className="mb-6 text-lg font-medium">
                  Already have a website? Let our AI analyze your current tech stack and suggest 
                  specific improvements to enhance performance, SEO, and user experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {improveFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + (index * 0.1) }}
                    >
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
                <ul className="space-y-3">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.3 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Comprehensive performance analysis</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.4 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">AI-powered improvement suggestions</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Interactive chat for detailed advice</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.6 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Step-by-step implementation guide</span>
                  </motion.li>
                </ul>
              </div>
              <Link href="/techstack/improve" className="block">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer"
                  asChild
                >
                  <span className="flex items-center justify-center">
                    Improve Existing Stack <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="h-full overflow-hidden border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-4 sticky top-0 z-10 m-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl font-extrabold tracking-tight text-purple-900 dark:text-purple-100 m-0">Tech Stack Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 text-slate-600">
                <p className="mb-6 text-lg font-medium">
                  Planning a new website or application? Get personalized technology stack recommendations 
                  based on your specific business needs, priorities, and budget.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {recommendFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + (index * 0.1) }}
                    >
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
                <ul className="space-y-3">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.3 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">AI-powered stack recommendations</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.4 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Detailed technology comparisons</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Implementation roadmap</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.6 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Expert consultation available</span>
                  </motion.li>
                </ul>
              </div>
              <Link href="/techstack/recommend" className="block">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white cursor-pointer"
                  asChild
                >
                  <span className="flex items-center justify-center">
                    Get Recommendations <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        {techStackFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + (index * 0.1) }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Not sure which service is right for you? Our tech experts can help guide you 
          to the most suitable solution for your specific needs.
        </p>
        <Button variant="outline" size="lg" className="border-blue-500 text-blue-600 hover:bg-blue-50 cursor-pointer">
          Contact Our Tech Experts
        </Button>
      </motion.div>
    </div>
  );
}
