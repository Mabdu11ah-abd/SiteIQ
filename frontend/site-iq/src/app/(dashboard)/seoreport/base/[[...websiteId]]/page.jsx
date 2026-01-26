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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Zap,
  Eye,
  Clock,
  Gauge,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
  Globe,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance.js";
import { LIGHTHOUSE_API } from "@/constants/seoreport.js";
import { useRouter } from "next/navigation";
console.log("LIGHTHOUSE_API", LIGHTHOUSE_API);
console.log("ANALYZE URL:", LIGHTHOUSE_API.ANALYZE);

// Circular progress component
const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  color = "hsl(262, 83%, 58%)",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981"; // green
    if (score >= 50) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

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
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance metric card
const MetricCard = ({ icon: Icon, label, value, unit, description, score }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatValue = (val) => {
    if (val === null || val === undefined) return "N/A";
    if (val < 1000) return val.toFixed(1);
    return (val / 1000).toFixed(1) + "k";
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          {score && (
            <Badge variant="outline" className={getScoreColor(score)}>
              {score >= 90
                ? "Good"
                : score >= 50
                ? "Needs Improvement"
                : "Poor"}
            </Badge>
          )}
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">
            {formatValue(value)} {unit}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SeoReportPage({ params }) {
  const  websiteId  =  params.websiteId?.[0];
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [seoReport, setSeoReport] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  // If website is provided, load existing report
  useEffect(() => {
    if (websiteId) {
      loadExistingReport(websiteId);
    }
  }, [websiteId]);

  const loadExistingReport = async (Id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(LIGHTHOUSE_API.GET_ONE(Id));
      if (response.data) {
        setSeoReport(response.data);
        if (response.data.lighthouse?.lighthouseReport) {
          const perfData = extractPerformanceSummary(
            response.data.lighthouse.lighthouseReport
          );
          setPerformanceData(perfData);
        }
      }
    } catch (err) {
      setError("Failed to load existing report");
    } finally {
      setLoading(false);
    }
  };

  const analyzeDomain = async () => {
    console.log("clicked on analyze");
    console.log(domain.trim());
    if (!domain.trim()) {
      setError("Please enter a valid domain");
      return;
    }
    console.log("still not reaching here");
    try {
      setLoading(true);
      setError("");

      console.log("Making api call ");
      const response = await axiosInstance.post(LIGHTHOUSE_API.ANALYZE, {
        domain: domain,
      });
      console.log("this is the response object ", response);

      if (response.data) {
        setSeoReport(response.data);
        if (response.data.lighthouse?.lighthouseReport) {
          console.log("extracting the performance data");

          // Add more detailed logging
          console.log("Lighthouse report structure:", {
            hasCategories:
              !!response.data.lighthouse.lighthouseReport.categories,
            hasPerformance:
              !!response.data.lighthouse.lighthouseReport.categories
                ?.performance,
            hasAudits: !!response.data.lighthouse.lighthouseReport.audits,
            categoriesKeys: response.data.lighthouse.lighthouseReport.categories
              ? Object.keys(
                  response.data.lighthouse.lighthouseReport.categories
                )
              : [],
            auditsKeys: response.data.lighthouse.lighthouseReport.audits
              ? Object.keys(
                  response.data.lighthouse.lighthouseReport.audits
                ).slice(0, 10)
              : [],
          });

          try {
            const perfData = extractPerformanceSummary(
              response.data.lighthouse.lighthouseReport
            );
            console.log("This is the performance data:");
            console.log(perfData);
            setPerformanceData(perfData);
            console.log("Performance data set successfully");
          } catch (extractError) {
            console.error("Error in extractPerformanceSummary:", extractError);
            console.log(
              "Lighthouse report sample:",
              JSON.stringify(
                response.data.lighthouse.lighthouseReport,
                null,
                2
              ).substring(0, 1000)
            );
          }
        }
      }
    } catch (err) {
      console.error("API call error:", err);
      setError(err.response?.data?.message || "Failed to analyze domain");
    } finally {
      setLoading(false);
    }
  };

  function extractPerformanceSummary(lighthouseJson) {
    console.log("Inside extractPerformanceSummary function");
    console.log("lighthouseJson exists:", !!lighthouseJson);
    console.log("audits exists:", !!lighthouseJson?.audits);

    if (!lighthouseJson) {
      throw new Error("Invalid Lighthouse JSON: Missing lighthouse data.");
    }

    if (!lighthouseJson.audits) {
      throw new Error("Invalid Lighthouse JSON: Missing audits data.");
    }

    const audits = lighthouseJson.audits;
    console.log("Available audits:", Object.keys(audits).slice(0, 10));

    // Calculate performance score based on key metrics
    // Since we don't have categories.performance.score, we'll calculate it ourselves
    const calculatePerformanceScore = (metrics) => {
      const weights = {
        fcp: 0.1,
        lcp: 0.25,
        cls: 0.15,
        fid: 0.1, // We'll use TBT as a proxy for FID
        speedIndex: 0.1,
        tti: 0.1,
      };

      let totalScore = 0;
      let totalWeight = 0;

      // FCP scoring
      if (metrics.fcp !== null) {
        const fcpScore =
          metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0;
        totalScore += fcpScore * weights.fcp;
        totalWeight += weights.fcp;
      }

      // LCP scoring
      if (metrics.lcp !== null) {
        const lcpScore =
          metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0;
        totalScore += lcpScore * weights.lcp;
        totalWeight += weights.lcp;
      }

      // CLS scoring
      if (metrics.cls !== null) {
        const clsScore =
          metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0;
        totalScore += clsScore * weights.cls;
        totalWeight += weights.cls;
      }

      // TBT scoring (as FID proxy)
      if (metrics.tbt !== null) {
        const tbtScore = metrics.tbt <= 200 ? 100 : metrics.tbt <= 600 ? 50 : 0;
        totalScore += tbtScore * weights.fid;
        totalWeight += weights.fid;
      }

      // Speed Index scoring
      if (metrics.speedIndex !== null) {
        const siScore =
          metrics.speedIndex <= 3400
            ? 100
            : metrics.speedIndex <= 5800
            ? 50
            : 0;
        totalScore += siScore * weights.speedIndex;
        totalWeight += weights.speedIndex;
      }

      // TTI scoring
      if (metrics.tti !== null) {
        const ttiScore =
          metrics.tti <= 3800 ? 100 : metrics.tti <= 7300 ? 50 : 0;
        totalScore += ttiScore * weights.tti;
        totalWeight += weights.tti;
      }

      return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    };

    // Extract metric values from audits
    const metrics = {
      fcp: audits["first-contentful-paint"]?.numericValue || null,
      lcp: audits["largest-contentful-paint"]?.numericValue || null,
      speedIndex: audits["speed-index"]?.numericValue || null,
      tbt: audits["total-blocking-time"]?.numericValue || null,
      cls: audits["cumulative-layout-shift"]?.numericValue || null,
      tti: audits["interactive"]?.numericValue || null,
    };

    const calculatedScore = calculatePerformanceScore(metrics);

    const result = {
      score: calculatedScore,
      ...metrics,
    };

    console.log("Extracted performance summary:", result);
    return result;
  }

  const calculateSeoScore = () => {
    if (!seoReport?.lighthouse?.lighthouseReport?.audits) return 0;

    const audits = seoReport.lighthouse.lighthouseReport.audits;
    const seoAudits = [
      "meta-description",
      "document-title",
      "link-text",
      "image-alt",
      "hreflang",
      "canonical",
    ];

    let totalScore = 0;
    let validAudits = 0;

    seoAudits.forEach((auditKey) => {
      if (
        audits[auditKey]?.score !== null &&
        audits[auditKey]?.score !== undefined
      ) {
        totalScore += audits[auditKey].score;
        validAudits++;
      }
    });

    return validAudits > 0 ? Math.round((totalScore / validAudits) * 100) : 0;
  };

  if (!websiteId && !seoReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SEO Performance Analysis
            </h1>
            <p className="text-gray-600">
              Enter your website URL to get comprehensive SEO and performance
              insights
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                Analyze Website
              </CardTitle>
              <CardDescription>
                Provide your website address to begin the SEO analysis process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="https://yourwebsite.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && analyzeDomain()}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={analyzeDomain}
                disabled={loading || !domain.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Website
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Analyzing your website...</p>
        </div>
      </div>
    );
  }

  const seoScore = calculateSeoScore();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="text-accent">SEO</span> Performance Report
            </h1>
            <p className="text-gray-600">
              {seoReport?.lighthouse?.lighthouseReport?.finalDisplayedUrl ||
                domain}
            </p>
          </div>

          {/* Score Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 ">
            <div className="transition-colors hover:bg-purple-50 rounded-xl">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Performance Score</CardTitle>
                  <CardDescription>Based on Core Web Vitals</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CircularProgress
                    value={performanceData?.score || 0}
                    label="Performance"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="transition-colors hover:bg-purple-50 rounded-xl">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>SEO Score</CardTitle>
                  <CardDescription>Search Engine Optimization</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CircularProgress value={seoScore} label="SEO" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="performance"
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Performance Details
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                SEO Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                  <CardDescription>
                    Key metrics that affect user experience and search rankings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard
                      icon={Clock}
                      label="First Contentful Paint"
                      value={performanceData?.fcp}
                      unit="ms"
                      description="Time until first content appears"
                      score={
                        performanceData?.fcp < 1800
                          ? 90
                          : performanceData?.fcp < 3000
                          ? 50
                          : 0
                      }
                    />
                    <MetricCard
                      icon={Eye}
                      label="Largest Contentful Paint"
                      value={performanceData?.lcp}
                      unit="ms"
                      description="Time until largest content loads"
                      score={
                        performanceData?.lcp < 2500
                          ? 90
                          : performanceData?.lcp < 4000
                          ? 50
                          : 0
                      }
                    />
                    <MetricCard
                      icon={Gauge}
                      label="Speed Index"
                      value={performanceData?.speedIndex}
                      unit="ms"
                      description="How quickly content is visually displayed"
                      score={
                        performanceData?.speedIndex < 3400
                          ? 90
                          : performanceData?.speedIndex < 5800
                          ? 50
                          : 0
                      }
                    />
                    <MetricCard
                      icon={TrendingUp}
                      label="Total Blocking Time"
                      value={performanceData?.tbt}
                      unit="ms"
                      description="Time when main thread was blocked"
                      score={
                        performanceData?.tbt < 200
                          ? 90
                          : performanceData?.tbt < 600
                          ? 50
                          : 0
                      }
                    />
                    <MetricCard
                      icon={Zap}
                      label="Cumulative Layout Shift"
                      value={performanceData?.cls}
                      unit=""
                      description="Visual stability of the page"
                      score={
                        performanceData?.cls < 0.1
                          ? 90
                          : performanceData?.cls < 0.25
                          ? 50
                          : 0
                      }
                    />
                    <MetricCard
                      icon={CheckCircle}
                      label="Time to Interactive"
                      value={performanceData?.tti}
                      unit="ms"
                      description="Time until page is fully interactive"
                      score={
                        performanceData?.tti < 3800
                          ? 90
                          : performanceData?.tti < 7300
                          ? 50
                          : 0
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>SEO Analysis</CardTitle>
                    <CardDescription>
                      Detailed search engine optimization insights
                    </CardDescription>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-accent text-primary-foreground"
                    onClick={() => router.push(`/seoreport/advanced/${websiteId}`)}
                  >
                    Advanced Analysis
                  </Button>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {seoReport?.lighthouse?.lighthouseReport?.audits &&
                      Object.entries(
                        seoReport.lighthouse.lighthouseReport.audits
                      )
                        .filter(([key, audit]) =>
                          [
                            "meta-description",
                            "document-title",
                            "link-text",
                            "image-alt",
                            "hreflang",
                            "canonical",
                          ].includes(key)
                        )
                        .map(([key, audit]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium">{audit.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {audit.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {audit.score === 1 ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              )}
                              <Badge
                                variant={
                                  audit.score === 1 ? "default" : "destructive"
                                }
                              >
                                {audit.score === 1 ? "Pass" : "Fail"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}