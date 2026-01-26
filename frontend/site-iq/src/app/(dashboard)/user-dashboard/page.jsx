"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Globe,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Eye,
    RefreshCw,
    Crown,
    Calendar,
    TrendingUp,
    ArrowRight,
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance.js";

// IMPORT ReactMarkdown and remarkGfm
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Components
function ProfileSection({ profile, isLoading }) {
    if (!profile) return null

    const getPlanColor = (plan) => {
        switch (plan.toLowerCase()) {
            case "free":
                return "bg-gray-100 text-gray-800 border-gray-300"
            case "pro":
                return "bg-blue-100 text-blue-800 border-blue-300"
            case "business":
                return "bg-purple-100 text-purple-800 border-purple-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    return (
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-600">@{profile.username}</p>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

function WebsitesSection({ websites, isLoading }) {
    const router = useRouter()

    return (
        <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    Your Websites
                </CardTitle>
                <Link href="/websites">
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {websites.map((website) => (
                        <Card key={website._id} className="border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">{website.domain}</h3>
                                        <Badge variant="outline" className="text-green-600 border-green-300">
                                            Active
                                        </Badge>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <p>Recommendations: {website.seoRecommendation.length}</p>
                                        <p>Chat Messages: {website.chatCount}</p>
                                    </div>

                                    {website.aiRecommendations?.summary && (
                                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                                            {website.aiRecommendations.summary}
                                        </div>
                                    )}

                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.push(`/website/${website._id}`)}
                                            className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Eye className="w-3 h-3 mr-1" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function RecommendationsSection({
    recommendations,
    isLoading,
}) {
    return (
        <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                    SEO Recommendations
                </CardTitle>

            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recommendations.slice(0, 3).map((recommendation) => (
                        <Card key={recommendation._id} className="border-gray-200 hover:border-blue-300 transition-colors">
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">{recommendation.action}</Badge>
                                        <span className="text-xs text-gray-500">
                                            {new Date(recommendation.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* MODIFIED LINE */}
                                    <div className="text-sm text-gray-700">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                // Apply styling to strong tags for the "pop of color"
                                                strong: ({ node, ...props }) => (
                                                    <strong className="text-blue-700 font-semibold bg-blue-50 px-1 py-0.5 rounded" {...props} />
                                                ),
                                                // Ensure paragraphs don't introduce unwanted block spacing if they're meant to be inline-like
                                                p: ({ node, ...props }) => (
                                                    <p className="inline" {...props} />
                                                )
                                                // You can add more component overrides here if other Markdown elements
                                                // appear in your truncated string and you want to style them.
                                                // For example, for links:
                                                // a: ({ node, ...props }) => (
                                                //   <a className="text-blue-600 hover:underline" {...props} />
                                                // ),
                                            }}
                                        >
                                            {/* Pass the truncated markdown string to ReactMarkdown */}
                                            {`${recommendation.recommendations.seo.substring(0, 200)}...`}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function ChatSection({ chatHistory, isLoading }) {
    return (
        <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Chat History
                </CardTitle>

            </CardHeader>
            <CardContent>
                {chatHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No chat history yet</p>
                        <p className="text-sm">Start a conversation with our AI assistant</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {chatHistory.map((chat) => (
                            <Card key={chat._id} className="border-gray-200">
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{chat.domain}</span>
                                        <span className="text-sm text-gray-500">{chat.chatCount} messages</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function TechStackSection({
    techStack,
    isLoading,
}) {
    return (
        <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Tech Stack Improvements
                </CardTitle>
                <Link href="/techstack">
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {techStack?.recent?.slice(0, 4).map((item) => (
                        <Card key={item._id} className="border-gray-200 hover:border-blue-300 transition-colors">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )) || (
                            <div className="text-center py-8 text-gray-500">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No tech stack improvements yet</p>
                                <p className="text-sm">Explore opportunities to enhance your website's performance</p>
                            </div>
                        )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function Dashboard() {
    const [profile, setProfile] = useState(null)
    const [websites, setWebsites] = useState([])
    const [chatHistory, setChatHistory] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [techStack, setTechStack] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch all dashboard data from your APIs using axiosInstance
                const [
                    profileRes,
                    websitesRes,
                    chatRes,
                    recommendationsRes,
                    techStackRes,
                ] = await Promise.all([
                    axiosInstance.get("/dashboard/overview"),
                    axiosInstance.get("/dashboard/websites"),
                    axiosInstance.get("/dashboard/chat-history"),
                    axiosInstance.get("/dashboard/seo-recommendations"),
                    axiosInstance.get("/dashboard/techstack"),
                ])

                setProfile(profileRes.data)
                setWebsites(websitesRes.data)
                setChatHistory(chatRes.data)
                setRecommendations(recommendationsRes.data)
                setTechStack(techStackRes.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
                console.error("Dashboard fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive" className="border-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Error loading dashboard: {error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="h-screen w-full border-0 flex items-center justify-center overflow-hidden bg-gray-50">
                <Skeleton className="h-12 w-1/2 bg-gray-200 animate-pulse" />
            </div>
        )
    }

    return (
        <div className="container w-full p-6 space-y-8 bg-white">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                </Button>
            </div>

            {/* User Profile Section */}
            <ProfileSection profile={profile} isLoading={isLoading} />

            {/* Websites Section */}
            <WebsitesSection websites={websites} isLoading={isLoading} />

            {/* SEO Recommendations Section */}
            <RecommendationsSection recommendations={recommendations} isLoading={isLoading} />

            {/* Chat History Section */}
            <ChatSection chatHistory={chatHistory} isLoading={isLoading} />

            {/* Tech Stack Section */}
            <TechStackSection techStack={techStack} isLoading={isLoading} />
        </div>
    )
}