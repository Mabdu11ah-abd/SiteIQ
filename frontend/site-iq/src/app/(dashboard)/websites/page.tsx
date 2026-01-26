"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Globe, MessageSquare, Calendar, ExternalLink, BarChart3, Lightbulb, Zap, Search } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import axios from "@/lib/axiosInstance.js";

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

interface Website {
    _id: string
    domain: string
    seoRecommendation: any[]
    chatCount: number
    chatHistory: any[]
    createdAt: string
    updatedAt: string
    seoReport?: string
}

export default function WebsitesPage() {
    const [sites, setSites] = useState<Website[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadWebsites() {
            try {
                setLoading(true)
                const res = await axios.get(`/websites`);
                setSites(res.data);
            } catch (error) {
                console.error(error)
                setError("Failed to load websites. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        loadWebsites()
    }, [])

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    const getDomainName = (url: string) => {
        try {
            return new URL(url).hostname.replace("www.", "")
        } catch {
            return url
        }
    }

    const getActivityStatus = (chatCount: number, updatedAt: string) => {
        const daysSinceUpdate = Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24))

        if (chatCount > 5 && daysSinceUpdate < 7) return { status: "active", color: "bg-emerald-400" }
        if (chatCount > 0 && daysSinceUpdate < 30) return { status: "moderate", color: "bg-amber-400" }
        return { status: "inactive", color: "bg-slate-300" }
    }

    const filteredSites = sites.filter((site) =>
        getDomainName(site.domain).toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 bg-slate-200 rounded-lg w-64"></div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Websites</h1>
                        <p className="text-slate-600 mt-1">Manage your SEO performance</p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Search websites..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Globe className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{sites.length}</p>
                                <p className="text-sm text-slate-600">Websites</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {sites.reduce((sum, site) => sum + site.chatCount, 0)}
                                </p>
                                <p className="text-sm text-slate-600">Chats</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{sites.filter((site) => site.seoReport).length}</p>
                                <p className="text-sm text-slate-600">Reports</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Lightbulb className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {sites.reduce((sum, site) => sum + (site.seoRecommendation?.length || 0), 0)}
                                </p>
                                <p className="text-sm text-slate-600">Tips</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Websites Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSites.map((site) => {
                        const activityStatus = getActivityStatus(site.chatCount, site.updatedAt)
                        const hasRecommendations = site.seoRecommendation && site.seoRecommendation.length > 0

                        return (
                            <Card
                                key={site._id}
                                className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white border-slate-200 overflow-hidden"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Globe className="h-6 w-6 text-white" />
                                                </div>
                                                <div
                                                    className={`absolute -bottom-1 -right-1 w-3 h-3 ${activityStatus.color} rounded-full border-2 border-white`}
                                                ></div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-slate-900 truncate">{getDomainName(site.domain)}</h3>
                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(site.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                            asChild
                                        >
                                            <Link href={site.domain} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Metrics */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{site.chatCount} chats</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Lightbulb className="h-4 w-4" />
                                            <span>{site.seoRecommendation?.length || 0} tips</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className={`text-xs ${activityStatus.status === "active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : activityStatus.status === "moderate"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {activityStatus.status === "active"
                                                ? "Active"
                                                : activityStatus.status === "moderate"
                                                    ? "Moderate"
                                                    : "Inactive"}
                                        </Badge>
                                        {site.seoReport && (
                                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                SEO Ready
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-2">
                                        {/* First Row: SEO Report + Tips/Generate */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                                                asChild
                                            >
                                                <Link href={`/seoreport/base/${site._id}`}>
                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                    SEO Report
                                                </Link>
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`transition-colors ${hasRecommendations
                                                        ? "hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
                                                        : "hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
                                                    }`}
                                                asChild
                                            >
                                                <Link
                                                    href={
                                                             `/recommendation/${site._id}`
                                                    }
                                                >
                                                    {hasRecommendations ? (
                                                        <>
                                                            <Lightbulb className="h-4 w-4 mr-2" />
                                                            Tips
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap className="h-4 w-4 mr-2" />
                                                            Generate SEO
                                                        </>
                                                    )}
                                                </Link>
                                            </Button>
                                        </div>

                                        {/* Second Row: Chat (Full Width) */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                                            asChild
                                        >
                                            <Link href={`/chat/${site._id}`}>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Chat with AI
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredSites.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Globe className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {searchTerm ? "No websites found" : "No websites available"}
                        </h3>
                        <p className="text-slate-600">
                            {searchTerm
                                ? `No websites match "${searchTerm}". Try a different search term.`
                                : "Your websites will appear here once they are created."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
