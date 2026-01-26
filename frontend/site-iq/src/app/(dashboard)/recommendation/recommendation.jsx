"use client";

import React, { useEffect, useState } from "react";
import SeoRecommendation from "@/components/SeoRecommendations";
import axios from "@/lib/axiosInstance.js";
import { Search, Sparkles, TrendingUp, Zap } from "lucide-react";

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = axios.post('/seoRecommendations/generate');
        if (!res.ok) throw new Error("Failed to fetch recommendations");

        const data = await res.json();
        const seoRecs = data.seoRecommendations || [];

        const extracted = seoRecs.map(
          (rec) => rec.recommendations?.seo || "No SEO recommendation found."
        );

        setRecommendations(extracted);
      } catch (err) {
        setError("Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <>

      {/* Header Section */}
      <div className="bg-white py-16 text-center border-b">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            SEO Recommendations
          </h1>
          <p className="text-gray-600 text-lg">
            Unlock your site’s potential with AI-powered, actionable SEO
            improvements.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {/* ...icons block... */}
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
                Analyzing your SEO opportunities...
              </div>
              <div className="text-gray-500">
                Hang tight, insights are on the way!
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

          {!loading && !error && recommendations.length > 0 && (
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
            </>
          )}

          {!loading && !error && recommendations.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              No SEO recommendations found.
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default Recommendation;
