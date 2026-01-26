"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Calendar,
  MessageSquare,
  BarChart3,
  Lightbulb,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Zap,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "@/lib/axiosInstance.js";

// Base URL for API calls
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Website {
  _id: string;
  domain: string;
  seoRecommendation: Array<{
    recommendations: {
      seo: string;
      lighthouse: string;
    };
    createdAt: string;
  }>;
  chatCount: number;
  chatHistory: any[];
  createdAt: string;
  updatedAt: string;
  seoReport?: {
    phraseResults: Array<{
      scores: {
        rankingPosition: number;
        keywordRelevance: number;
        richSnippets: number;
        urlStructure: number;
        visibility: number;
        competitorAnalysis: number;
        paginationStrength: number;
        total: number;
      };
      phrase: string;
    }>;
    lighthouse: {
      error?: any;
      lighthouseReport?: any;
      logs: string[];
    };
    scanDate: string;
  };
}

export default function WebsitePage() {
  const params = useParams();
  const websiteId = params.id as string;
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );

  useEffect(() => {
    async function loadWebsite() {
      try {
        setLoading(true);
 
    const res = await axios.get(`/websites/${websiteId}`);

    setWebsite(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load website data");
      } finally {
        setLoading(false);
      }
    }

    loadWebsite();
  }, [websiteId]);

  const getDomainName = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getScoreColor = (score: number, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  const formatMarkdown = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Headers
        if (line.startsWith("### ")) {
          return `<h3 key=${i} class="text-lg font-bold mt-4 mb-2">${line.substring(
            4
          )}</h3>`;
        } else if (line.startsWith("## ")) {
          return `<h2 key=${i} class="text-xl font-bold mt-6 mb-3">${line.substring(
            3
          )}</h2>`;
        } else if (line.startsWith("# ")) {
          return `<h1 key=${i} class="text-2xl font-bold mt-8 mb-4">${line.substring(
            2
          )}</h1>`;
        }

        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Lists
        if (/^\d+\.\s/.test(line)) {
          return `<div key=${i} class="ml-4 my-1">${line}</div>`;
        }
        if (line.startsWith("- ")) {
          return `<div key=${i} class="ml-4 my-1">• ${line.substring(2)}</div>`;
        }

        return line
          ? `<div key=${i} class="my-2">${line}</div>`
          : `<div key=${i} class="h-2"></div>`;
      })
      .join("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading website details...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Website
            </h3>
            <p className="text-slate-600 mb-4">
              {error || "Website not found"}
            </p>
            <Button asChild>
              <Link href="/websites">Back to Websites</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasLighthouseError = website.seoReport?.lighthouse?.error;
  const hasRecommendations =
    website.seoRecommendation && website.seoRecommendation.length > 0;
  const phraseResults = website.seoReport?.phraseResults || [];
  const averageScore =
    phraseResults.length > 0
      ? Math.round(
          phraseResults.reduce((sum, result) => sum + result.scores.total, 0) /
            phraseResults.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/user-dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {getDomainName(website.domain)}
              </h1>
              <p className="text-slate-600 mt-1">
                Website Analysis & SEO Report
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={website.domain} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/chat/${website._id}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Overall SEO Score</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      averageScore
                    )}`}
                  >
                    {averageScore > 0 ? `${averageScore}/100` : "N/A"}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Chat Messages</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {website.chatCount}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Recommendations</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {website.seoRecommendation?.length || 0}
                  </p>
                </div>
                <Lightbulb className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Last Updated</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(website.updatedAt)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="seo-scores">SEO Scores</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={
                        previewDevice === "desktop" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewDevice("desktop")}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Desktop
                    </Button>
                    <Button
                      variant={
                        previewDevice === "mobile" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setPreviewDevice("mobile")}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                  {previewDevice === "desktop" ? (
                    // Desktop Preview
                    <div className="relative">
                      {/* Laptop Frame */}
                      <div className="relative bg-slate-800 rounded-t-2xl p-4 shadow-2xl">
                        {/* Laptop Screen Bezel */}
                        <div className="bg-black rounded-lg p-2">
                          {/* Website Content */}
                          <div
                            className="bg-white rounded-md overflow-hidden"
                            style={{ width: "800px", height: "500px" }}
                          >
                            <iframe
                              src={website.domain}
                              className="w-full h-full border-0"
                              title={`Preview of ${getDomainName(
                                website.domain
                              )}`}
                              sandbox="allow-same-origin allow-scripts allow-forms"
                            />
                          </div>
                        </div>
                        {/* Laptop Camera */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-600 rounded-full"></div>
                      </div>
                      {/* Laptop Base */}
                      <div
                        className="bg-slate-700 h-4 rounded-b-2xl shadow-lg"
                        style={{ width: "820px", marginLeft: "-10px" }}
                      >
                        <div className="flex justify-center pt-1">
                          <div className="w-16 h-1 bg-slate-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Mobile Preview
                    <div className="relative">
                      {/* Phone Frame */}
                      <div className="bg-slate-800 rounded-3xl p-3 shadow-2xl">
                        {/* Phone Screen */}
                        <div className="bg-black rounded-2xl p-1">
                          {/* Website Content */}
                          <div
                            className="bg-white rounded-xl overflow-hidden"
                            style={{ width: "320px", height: "600px" }}
                          >
                            <iframe
                              src={website.domain}
                              className="w-full h-full border-0"
                              title={`Mobile preview of ${getDomainName(
                                website.domain
                              )}`}
                              sandbox="allow-same-origin allow-scripts allow-forms"
                            />
                          </div>
                        </div>
                        {/* Phone Camera/Notch */}
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black rounded-full"></div>
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-600 rounded-full"></div>
                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-slate-600 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Info */}
                <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-4">
                    <span>Viewing: {getDomainName(website.domain)}</span>
                    <Badge variant="outline">
                      {previewDevice === "desktop" ? "800x500" : "320x600"}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={website.domain} target="_blank">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in New Tab
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Website Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Domain
                    </label>
                    <p className="text-slate-900">{website.domain}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Created
                    </label>
                    <p className="text-slate-900">
                      {formatDate(website.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Last Scan
                    </label>
                    <p className="text-slate-900">
                      {website.seoReport?.scanDate
                        ? formatDate(website.seoReport.scanDate)
                        : "Not scanned yet"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href={`/seoreport/base/${website._id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full SEO Report
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/chat/${website._id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with AI Assistant
                    </Link>
                  </Button>
                  {hasRecommendations ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={`/recommendation/${website._id}`}>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        View Recommendations
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={`/recommendation/${website._id}`}>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate SEO Report
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status Alerts */}
            <div className="space-y-4">
              {hasLighthouseError && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Lighthouse Analysis Failed:</strong>{" "}
                    {website.seoReport?.lighthouse?.error?.message ||
                      "Unable to analyze website performance"}
                  </AlertDescription>
                </Alert>
              )}

              {!hasRecommendations && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>No SEO Recommendations Yet:</strong> Generate your
                    first SEO analysis to get personalized recommendations.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* SEO Scores Tab */}
          <TabsContent value="seo-scores" className="space-y-6">
            {phraseResults.length > 0 ? (
              <div className="space-y-6">
                {phraseResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Keyword: "{result.phrase}"</span>
                        <Badge
                          variant={getScoreBadgeVariant(result.scores.total)}
                        >
                          {result.scores.total}/100
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              Ranking Position
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.rankingPosition,
                                10
                              )}`}
                            >
                              {result.scores.rankingPosition}/10
                            </span>
                          </div>
                          <Progress
                            value={(result.scores.rankingPosition / 10) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              Keyword Relevance
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.keywordRelevance,
                                10
                              )}`}
                            >
                              {result.scores.keywordRelevance}/10
                            </span>
                          </div>
                          <Progress
                            value={(result.scores.keywordRelevance / 10) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              Rich Snippets
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.richSnippets,
                                10
                              )}`}
                            >
                              {result.scores.richSnippets}/10
                            </span>
                          </div>
                          <Progress
                            value={(result.scores.richSnippets / 10) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              URL Structure
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.urlStructure,
                                10
                              )}`}
                            >
                              {result.scores.urlStructure}/10
                            </span>
                          </div>
                          <Progress
                            value={(result.scores.urlStructure / 10) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              Visibility
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.visibility,
                                10
                              )}`}
                            >
                              {result.scores.visibility}/10
                            </span>
                          </div>
                          <Progress
                            value={(result.scores.visibility / 10) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              Competitor Analysis
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.competitorAnalysis,
                                10
                              )}`}
                            >
                              {result.scores.competitorAnalysis}/10
                            </span>
                          </div>
                          <Progress
                            value={
                              (result.scores.competitorAnalysis / 10) * 100
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                              Pagination
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                result.scores.paginationStrength,
                                10
                              )}`}
                            >
                              {result.scores.paginationStrength}/10
                            </span>
                          </div>
                          <Progress
                            value={
                              (result.scores.paginationStrength / 10) * 100
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900">
                              Total Score
                            </span>
                            <span
                              className={`text-sm font-bold ${getScoreColor(
                                result.scores.total
                              )}`}
                            >
                              {result.scores.total}/100
                            </span>
                          </div>
                          <Progress
                            value={result.scores.total}
                            className="h-3"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No SEO Scores Available
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Generate an SEO report to see detailed scoring metrics.
                  </p>
                  <Button asChild>
                    <Link href={`/seoreport/${website._id}`}>
                      Generate SEO Report
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {hasRecommendations ? (
              <div className="space-y-6">
                {website.seoRecommendation.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>SEO Recommendations</span>
                        <Badge variant="outline">
                          {formatDate(rec.createdAt)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdown(rec.recommendations.seo),
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Lightbulb className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No Recommendations Available
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Generate SEO recommendations to get personalized improvement
                    tips.
                  </p>
                  <Button asChild>
                    <Link href={`/recommendation/${website._id}`}>
                      Generate Recommendations
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lighthouse Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Lighthouse Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasLighthouseError ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Analysis Failed</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {website.seoReport?.lighthouse?.error?.message ||
                          "Unable to analyze website"}
                      </p>
                      <div className="bg-slate-100 rounded-lg p-3">
                        <p className="text-xs text-slate-600 font-mono">
                          {website.seoReport?.lighthouse?.logs?.join("\n") ||
                            "No logs available"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Analysis Completed</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scan Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scan Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Last Scan Date
                    </label>
                    <p className="text-slate-900">
                      {website.seoReport?.scanDate
                        ? formatDate(website.seoReport.scanDate)
                        : "Never scanned"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Keywords Analyzed
                    </label>
                    <p className="text-slate-900">{phraseResults.length}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <Badge
                      variant={hasLighthouseError ? "destructive" : "default"}
                    >
                      {hasLighthouseError ? "Error" : "Completed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
