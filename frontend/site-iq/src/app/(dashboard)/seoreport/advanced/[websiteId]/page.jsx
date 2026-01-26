"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  TrendingUp,
  Eye,
  Link,
  Star,
  Users,
  BarChart3,
  RefreshCw,
  Plus,
  Loader2,
  AlertCircle,
  Target,
  Globe,
  Trash2,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance.js";
import { SEO_REPORT_API } from "@/constants/seoreport.js";
import { useParams } from "next/navigation";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

console.log("seoreportapi", SEO_REPORT_API);
console.log("ANALYZE URL:", SEO_REPORT_API.GET_WEBSITE);

// Circular progress component for loading states
const CircularProgress = ({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  isLoading = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // green
    if (score >= 60) return "#f59e0b"; // yellow
    if (score >= 40) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <Loader2 className="w-full h-full animate-spin text-purple-600" />
        </div>
        <div className="text-xs text-muted-foreground mt-2">{label}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted-foreground/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor(value)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold">{value}</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

// Score metric component
const ScoreMetric = ({
  icon: Icon,
  label,
  value,
  maxValue = 100,
  description,
  color = "purple",
}) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <Card className={`${getScoreColor(percentage)} border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <Badge variant="outline" className="font-bold">
            {value}/{maxValue}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-current h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs opacity-75">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Phrase result card component
const PhraseResultCard = ({
  phraseResult,
  onReanalyze,
  onDelete,
  isReanalyzing,
}) => {
  const { phrase, scores } = phraseResult;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />"{phrase}"
            </CardTitle>
            <CardDescription>Keyword Analysis Results</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CircularProgress
              value={scores.total}
              size={60}
              label="Total"
              isLoading={isReanalyzing}
            />
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReanalyze(phrase)}
                disabled={isReanalyzing}
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${
                    isReanalyzing ? "animate-spin" : ""
                  }`}
                />
                Re-analyze
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(phrase)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <ScoreMetric
            icon={TrendingUp}
            label="Ranking Position"
            value={scores.rankingPosition}
            maxValue={100}
            description="Current search ranking position"
          />
          <ScoreMetric
            icon={Target}
            label="Keyword Relevance"
            value={scores.keywordRelevance}
            maxValue={100}
            description="How relevant the keyword is to your content"
          />
          <ScoreMetric
            icon={Star}
            label="Rich Snippets"
            value={scores.richSnippets}
            maxValue={100}
            description="Structured data and rich snippet optimization"
          />
          <ScoreMetric
            icon={Link}
            label="URL Structure"
            value={scores.urlStructure}
            maxValue={100}
            description="URL optimization for the target keyword"
          />
          <ScoreMetric
            icon={Eye}
            label="Visibility"
            value={scores.visibility}
            maxValue={100}
            description="Overall search visibility score"
          />
          <ScoreMetric
            icon={Users}
            label="Competitor Analysis"
            value={scores.competitorAnalysis}
            maxValue={100}
            description="Performance vs competitors"
          />
          <ScoreMetric
            icon={BarChart3}
            label="Pagination Strength"
            value={scores.paginationStrength}
            maxValue={100}
            description="Internal linking and page authority"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdvancedSeoReports({}) {
  const { websiteId } = useParams();
  const [seoReport, setSeoReport] = useState(null);
  const [phraseResults, setPhraseResults] = useState([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzingPhrase, setAnalyzingPhrase] = useState("");
  const [reanalyzingPhrase, setReanalyzingPhrase] = useState("");
  const [error, setError] = useState("");

  // Load existing phrase results on component mount
  useEffect(() => {
    console.log(websiteId);
    if (websiteId) {
      loadPhraseResults();
    }
  }, [websiteId]);

  const loadPhraseResults = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${SEO_REPORT_API.GET_WEBSITE(websiteId)}`
      );
      const seoReport = response.data.seoReport;
      const phraseResult = seoReport.phraseResults;
      setPhraseResults(phraseResult || []);
    } catch (err) {
      setError("Failed to load phrase results");
    } finally {
      setLoading(false);
    }
  };

  const analyzeNewPhrase = async () => {
    if (!newPhrase.trim()) {
      setError("Please enter a phrase to analyze");
      return;
    }

    try {
      setAnalyzingPhrase(newPhrase);
      setError("");

      const response = await axiosInstance.post(`${SEO_REPORT_API.GENERATE}`, {
        phrase: newPhrase.trim(),
        websiteId: websiteId,
      });
      // Extract the phraseResult from the response
      const newPhraseResult = response.data.phraseResult;
      if (newPhraseResult) {
        // Add the phraseResult (not the entire response) to the list
        setPhraseResults((prev) => [...prev, newPhraseResult]);
        setNewPhrase("");
      } else {
        console.error("❌ No phraseResult found in response");
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("❌ Error analyzing new phrase:", err);
      console.error("📋 Error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to analyze phrase");
    } finally {
      setAnalyzingPhrase("");
    }
  };

  const reanalyzePhrase = async (phrase) => {
    try {
      setReanalyzingPhrase(phrase);
      setError("");

      const response = await axiosInstance.post(`${SEO_REPORT_API.GENERATE}`, {
        phrase,
        websiteId,
      });

      const updatedPhraseResult = response.data?.phraseResult;

      setPhraseResults((prev) => {
        const exists = prev.some((result) => result.phrase === phrase);
        if (exists) {
          // Replace the existing phrase result
          return prev.map((result) =>
            result.phrase === phrase ? updatedPhraseResult : result
          );
        } else {
          // Insert new phrase result
          return [...prev, updatedPhraseResult];
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reanalyze phrase");
    } finally {
      setReanalyzingPhrase("");
    }
  };

  const deletePhrase = async (phrase) => {

    if (
      !confirm(`Are you sure you want to delete the analysis for "${phrase}"?`)
    ) {
      return;
    }

    try {
      await axiosInstance.delete(
        `${SEO_REPORT_API.DELETE_PHRASE(websiteId, phrase)}`
      );

      // Remove from local state
      setPhraseResults((prev) =>
        prev.filter((result) => result.phrase !== phrase)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete phrase");
    }
  };

  const calculateOverallScore = () => {
    if (!phraseResults || phraseResults.length === 0) {
      return 0;
    }

    const validScores = phraseResults
      .filter(
        (result) =>
          result && result.scores && typeof result.scores.total === "number"
      )
      .map((result) => result.scores.total);

    if (validScores.length === 0) {
      return 0;
    }

    const totalScore = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / validScores.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Advanced SEO Analysis
            </h1>
            <p className="text-gray-600">
              Detailed keyword and phrase performance analysis for{" "}
              {"your website"}
            </p>
          </div>

          {/* Overall Score Card */}
          {phraseResults.length > 0 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Overall SEO Performance</CardTitle>
                <CardDescription>
                  Average score across all analyzed phrases
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CircularProgress
                  value={calculateOverallScore()}
                  size={120}
                  label="Overall Score"
                />
              </CardContent>
            </Card>
          )}

          {/* Add New Phrase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Analyze New Phrase
              </CardTitle>
              <CardDescription>
                Enter a keyword or phrase to get detailed SEO analysis and
                scoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword or phrase (e.g., 'best pizza restaurant')"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && analyzeNewPhrase()}
                  disabled={!!analyzingPhrase}
                />
                <Button
                  onClick={analyzeNewPhrase}
                  disabled={!newPhrase.trim() || !!analyzingPhrase}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {analyzingPhrase ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {analyzingPhrase && (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <CircularProgress
                      value={0}
                      size={100}
                      label="Analyzing..."
                      isLoading={true}
                    />
                    <p className="text-sm text-muted-foreground">
                      Analyzing "{analyzingPhrase}" - This may take a few
                      moments...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Phrase Results */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">Loading phrase results...</p>
              </div>
            </div>
          ) : phraseResults.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Phrase Analysis Results
                </h2>
                <Badge variant="outline" className="text-sm">
                  {phraseResults.length} phrase
                  {phraseResults.length !== 1 ? "s" : ""} analyzed
                </Badge>
              </div>

              {phraseResults.map((phraseResult, index) => (
                <PhraseResultCard
                  key={`${phraseResult.phrase}-${index}`}
                  phraseResult={phraseResult}
                  onReanalyze={reanalyzePhrase}
                  onDelete={deletePhrase}
                  isReanalyzing={reanalyzingPhrase === phraseResult.phrase}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Phrases Analyzed Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by entering a keyword or phrase above to get detailed
                  SEO insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
