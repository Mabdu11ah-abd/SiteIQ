"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoRecommendation from "@/components/SeoRecommendations";
import axios from "@/lib/axiosInstance.js";
import { Search, Sparkles, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";

const Recommendation = () => {
  const { websiteId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchExistingRecommendations = async () => {
    try {
      const response = await axios.get(`/seoRecommendations/${websiteId}`);
      const data = response.data;
      
      if (data.recommendations && data.recommendations.length > 0) {
        const extracted = data.recommendations.map(
          (rec) => rec.recommendations?.seo || "No SEO recommendation found."
        );
        
        // Filter out empty recommendations
        const validRecommendations = extracted.filter(
          rec => rec !== "No SEO recommendation found." && rec.trim() !== ""
        );
        
        if (validRecommendations.length > 0) {
          setRecommendations(validRecommendations);
          return true; // Found existing recommendations
        }
      }
      return false; // No valid recommendations found
    } catch (err) {
      console.error("Error fetching existing recommendations:", err);
      return false; // Treat as no recommendations found
    }
  };

  const generateNewRecommendations = async () => {
    try {
      setGenerating(true);
      setError("");
      
      const response = await axios.post(`/seoRecommendations/generate/${websiteId}`);
      const data = response.data;
      
      if (data.recommendation?.seo) {
        setRecommendations([data.recommendation.seo]);
      } else {
        throw new Error("No SEO recommendation received from generation");
      }
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Could not generate recommendations. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    await generateNewRecommendations();
  };

  useEffect(() => {
    const initializeRecommendations = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("Website ID:", websiteId);
        
        // First, try to fetch existing recommendations
        const hasExisting = await fetchExistingRecommendations();
        
        // If no existing recommendations, generate new ones
        if (!hasExisting) {
          await generateNewRecommendations();
        }
      } catch (err) {
        console.error("Error initializing recommendations:", err);
        setError("Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    if (websiteId) {
      initializeRecommendations();
    }
  }, [websiteId]);

  return (
    <>

      {/* Header Section */}
      <div className="bg-white py-16 text-center border-b">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            SEO Recommendations
          </h1>
          <p className="text-gray-600 text-lg">
            Unlock your site's potential with AI-powered, actionable SEO
            improvements.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="flex items-center gap-3 text-gray-700">
              <Search className="w-8 h-8 text-blue-600" />
              <span className="font-medium">Search Analysis</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="font-medium">AI Insights</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="font-medium">Growth Opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Zap className="w-8 h-8 text-yellow-600" />
              <span className="font-medium">Quick Wins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-purple-700 rounded-full animate-spin"></div>
              </div>
              <div className="mt-6 text-gray-700 text-xl font-medium">
                Loading your SEO recommendations...
              </div>
              <div className="text-gray-500">
                Please wait while we fetch your insights!
              </div>
            </div>
          )}

          {generating && (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
              </div>
              <div className="mt-6 text-gray-700 text-xl font-medium">
                Generating new SEO recommendations...
              </div>
              <div className="text-gray-500">
                Our AI is analyzing your website for optimization opportunities!
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-red-100 border border-red-200 rounded-2xl p-8">
                <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M4.93 19h14.14c1.5 0 2.45-1.7 1.7-2.55L13.7 4.45c-.75-.85-1.95-.85-2.7 0L3.22 16.45c-.75.85.2 2.55 1.7 2.55z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Error Loading Recommendations
                </h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !generating && !error && recommendations.length > 0 && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Your Personalized SEO Action Plan
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Based on our AI analysis, here are specific, practical steps
                  to enhance your SEO performance.
                </p>
              </div>

              <div className="grid gap-8">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <SeoRecommendation markdown={rec} />
                  </div>
                ))}
              </div>

              {/* Regenerate Button */}
              <div className="text-center mt-16 pt-8 border-t border-gray-200">
                <button
                  onClick={handleRegenerate}
                  disabled={generating}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
                  {generating ? 'Regenerating...' : 'Regenerate Recommendations'}
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Get fresh insights with updated SEO recommendations
                </p>
              </div>
            </>
          )}

          {!loading && !generating && !error && recommendations.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                  No Recommendations Available
                </h3>
                <p className="text-yellow-600 mb-4">
                  We couldn't find any SEO recommendations for this website.
                </p>
                <button
                  onClick={handleRegenerate}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300"
                >
                  Generate Recommendations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

          
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default Recommendation;