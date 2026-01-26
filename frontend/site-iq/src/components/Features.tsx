'use client';
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  delay?: number 
}) => {
  return (
    <Card className="opacity-0 animate-fade-in border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${delay}s` }}>
      <CardContent className="p-6 sm:p-8">
        <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background gradient effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 opacity-0 animate-fade-in">
            All-in-One <span className="gradient-text">SEO Solution</span>
          </h2>
          <p className="text-gray-600 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            SiteIQ combines powerful SEO analysis with AI recommendations to help you optimize your website and stay ahead of the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            title="Comprehensive SEO Analysis"
            description="Get detailed insights on page speed, meta tags, content quality, keyword usage, and more with our advanced SEO analysis tools."
            delay={0.3}
          />
          
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="AI-Powered Recommendations"
            description="Our LLM-powered AI analyzes your SEO data and provides actionable recommendations to improve your website's performance."
            delay={0.5}
          />
          
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            title="Tech Stack Suggestions"
            description="Get tailored technology stack recommendations based on your business needs and website requirements."
            delay={0.7}
          />
          
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>}
            title="AI Chatbot Assistant"
            description="Chat with our AI assistant to get instant answers to your SEO questions and personalized advice for your website."
            delay={0.9}
          />
          
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            title="Detailed Reports"
            description="Generate comprehensive SEO reports that highlight issues, strengths, and opportunities for your website."
            delay={1.1}
          />
          
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Real-Time Monitoring"
            description="Keep track of your website's SEO performance over time with real-time analytics and monitoring tools."
            delay={1.3}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
