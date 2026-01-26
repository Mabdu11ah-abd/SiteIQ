'use clint';
import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-sm font-medium text-accent animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
            Next-gen SEO analysis powered by AI
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Supercharge Your Website's <span className="gradient-text">SEO Performance</span>
          </h1>
          
          <p className="text-lg text-gray-600 md:text-xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
            SiteIQ analyzes your website, generates comprehensive SEO reports, and provides AI-powered recommendations to boost your online visibility.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Button size="lg" className="gradient-bg text-white">
              Try It Free
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </Button>
          </div>
          
          <div className="pt-10 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <div className="p-1 rounded-xl bg-gradient-to-r from-secondary to-primary">
              <div className="w-full h-full glass-card p-4 sm:p-6 overflow-hidden rounded-lg">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg shadow-inner overflow-hidden">
                  <div className="absolute top-4 left-4 right-4 h-8 bg-white rounded-md shadow flex items-center px-4">
                    <div className="flex space-x-2 mr-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 h-5 bg-gray-100 rounded"></div>
                  </div>
                  
                  <div className="absolute top-16 left-4 right-4 bottom-4 flex gap-4">
                    <div className="w-1/3 space-y-3">
                      <div className="h-6 bg-blue-100 rounded w-2/3 animate-pulse-slow"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                      <div className="h-10 bg-green-100 rounded w-full mt-4"></div>
                    </div>
                    
                    <div className="w-2/3 bg-white rounded-lg shadow-sm p-3">
                      <div className="h-5 bg-gray-100 rounded w-1/3 mb-3"></div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                          <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100"></div>
                          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-100"></div>
                          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 flex flex-wrap justify-center gap-8 animate-fade-in opacity-70" style={{ animationDelay: "1.1s" }}>
            <div className="text-lg font-bold text-gray-400">TechCrunch</div>
            <div className="text-lg font-bold text-gray-400">Forbes</div>
            <div className="text-lg font-bold text-gray-400">Wired</div>
            <div className="text-lg font-bold text-gray-400">ProductHunt</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
