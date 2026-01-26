"use client"

import type React from "react"

import { useEffect, useState, useRef, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Send, Bot, User, Globe, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance";
// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

interface ChatMessage {
    userMessage: string
    botResponse: string
    createdAt: string
}

export default function ChatPage() {
    const params = useParams()
    const websiteId = params.id as string
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [currentResponse, setCurrentResponse] = useState("")
    const [displayedResponse, setDisplayedResponse] = useState("")
    const [currentUserMessage, setCurrentUserMessage] = useState("")
    const [domainName, setDomainName] = useState("")

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Load chat history
    useEffect(() => {
        async function loadChatHistory() {
            try {
                setIsLoading(true)
                const res = await axiosInstance.get(`/websiteChat/${websiteId}`)
                setChatHistory(res.data.chatHistory || [])

                // Try to get domain name from localStorage or set a placeholder
                const storedSites = localStorage.getItem("websites")
                if (storedSites) {
                    const sites = JSON.parse(storedSites)
                    const site = sites.find((site: any) => site._id === websiteId)
                    if (site) {
                        try {
                            setDomainName(new URL(site.domain).hostname)
                        } catch {
                            setDomainName(site.domain)
                        }
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        loadChatHistory()
    }, [websiteId])

    // Auto scroll to bottom
    useEffect(() => {
        scrollToBottom()
    }, [chatHistory, displayedResponse, isSending])

    // Typing animation effect
    useEffect(() => {
        if (isTyping && displayedResponse.length < currentResponse.length) {
            const timer = setTimeout(() => {
                setDisplayedResponse(currentResponse.slice(0, displayedResponse.length + 1))
            }, 10) // Faster typing speed
            return () => clearTimeout(timer)
        } else if (isTyping && displayedResponse.length >= currentResponse.length) {
            // Typing complete
            setIsTyping(false)
            setChatHistory((prev) => [
                ...prev,
                {
                    userMessage: currentUserMessage,
                    botResponse: currentResponse,
                    createdAt: new Date().toISOString(),
                },
            ])
            setCurrentResponse("")
            setDisplayedResponse("")
            setCurrentUserMessage("")
        }
    }, [isTyping, displayedResponse, currentResponse, currentUserMessage])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!message.trim() || isSending || isTyping) return

        const userMessage = message.trim()
        setCurrentUserMessage(userMessage)
        setMessage("")
        setIsSending(true)

        try {
            const res = await axiosInstance.post(`/websiteChat`, {
                websiteId,
                message: userMessage,
            })


            const data = res.data
            if (!data || !data.reply) {
                console.error("Failed to send message")
                setCurrentUserMessage("")
                return
            }

            // Start typing animation
            setCurrentResponse(data.reply)
            setDisplayedResponse("")
            setIsTyping(true)
        } catch (error) {
            console.error(error)
            setCurrentUserMessage("")
        } finally {
            setIsSending(false)
            if (textareaRef.current) {
                textareaRef.current.focus()
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as FormEvent)
        }
    }

    // Format message with basic markdown - Fixed cursor positioning
    const formatMessage = (text: string, showCursor = false) => {
        const lines = text.split("\n")
        const formattedLines = lines.map((line, i) => {
            // Bold text
            line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

            // Numbered lists
            if (/^\d+\.\s/.test(line)) {
                return `<div class="ml-4 my-1">${line}</div>`
            }

            // Bullet points
            if (line.startsWith("- ")) {
                return `<div class="ml-4 my-1">• ${line.substring(2)}</div>`
            }

            return line ? `<span class="leading-relaxed">${line}</span>` : "<div class='h-2'></div>"
        })

        // Add cursor to the last line if showing cursor
        if (showCursor && formattedLines.length > 0) {
            const lastIndex = formattedLines.length - 1
            const lastLine = formattedLines[lastIndex]
            if (lastLine.includes("<span")) {
                formattedLines[lastIndex] = lastLine.replace(
                    "</span>",
                    '<span class="inline-block w-0.5 h-4 bg-slate-800 animate-pulse ml-0.5"></span></span>',
                )
            } else {
                formattedLines[lastIndex] =
                    lastLine + '<span class="inline-block w-0.5 h-4 bg-slate-800 animate-pulse ml-0.5"></span>'
            }
        }

        return formattedLines.join("")
    }

    // Three dots loading animation component
    const TypingIndicator = () => (
        <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading chat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Left Sidebar */}
            <div className="w-80 bg-white border-r border-slate-200 p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/user-dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="font-semibold">SEO Chat Assistant</h2>
                </div>

                <div className="space-y-4 flex-1">
                    {/* <div className="bg-slate-100 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Website</h3>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-slate-500" />
                            <p className="text-sm text-slate-600 truncate">{domainName || "Loading..."}</p>
                        </div>
                    </div> */}

                    <div className="bg-slate-100 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Chat Statistics</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-600">{chatHistory.length} messages</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-600">
                                    {chatHistory.length > 0
                                        ? new Date(chatHistory[chatHistory.length - 1].createdAt).toLocaleDateString()
                                        : "No messages yet"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-100 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Quick Tips</h3>
                        <ul className="text-xs text-slate-600 space-y-1">
                            <li>• Ask about your SEO score</li>
                            <li>• Request improvement tips</li>
                            <li>• Get keyword suggestions</li>
                            <li>• Ask for competitor insights</li>
                            <li>• Request technical SEO advice</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h1 className="font-semibold">SEO Assistant</h1>
                            <p className="text-xs text-slate-500">Online • Ready to help</p>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.length === 0 && !isSending && !isTyping ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                <Bot className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Welcome to SEO Assistant</h3>
                            <p className="text-slate-600 max-w-md">
                                I'm here to help you with SEO recommendations based on your website's performance. Ask me anything!
                            </p>
                        </div>
                    ) : (
                        <>
                            {chatHistory.map((chat, index) => (
                                <div key={index} className="space-y-4">
                                    {/* User Message - Right Side */}
                                    <div className="flex justify-end">
                                        <div className="flex items-start gap-3 max-w-[70%]">
                                            <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-md px-4 py-3">
                                                <p className="text-sm leading-relaxed">{chat.userMessage}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bot Message - Left Side */}
                                    <div className="flex justify-start">
                                        <div className="flex items-start gap-3 max-w-[70%]">
                                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                                <Bot className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3">
                                                <div
                                                    className="text-sm text-slate-800 leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: formatMessage(chat.botResponse) }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Current conversation in progress */}
                            {(isSending || isTyping || currentUserMessage) && (
                                <div className="space-y-4">
                                    {/* Current User Message */}
                                    {currentUserMessage && (
                                        <div className="flex justify-end">
                                            <div className="flex items-start gap-3 max-w-[70%]">
                                                <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-md px-4 py-3">
                                                    <p className="text-sm leading-relaxed">{currentUserMessage}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bot Response - Typing or Loading */}
                                    <div className="flex justify-start">
                                        <div className="flex items-start gap-3 max-w-[70%]">
                                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                                <Bot className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3">
                                                {isSending ? (
                                                    <TypingIndicator />
                                                ) : isTyping ? (
                                                    <div
                                                        className="text-sm text-slate-800 leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: formatMessage(displayedResponse, true) }}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 p-4">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <div className="flex-1 relative">
                            <Textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your website's SEO..."
                                className="min-h-[50px] max-h-[120px] resize-none border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                disabled={isSending || isTyping}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!message.trim() || isSending || isTyping}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-[50px] px-4 rounded-lg"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    <p className="text-xs text-slate-500 mt-2 text-center">Press Enter to send, Shift+Enter for a new line</p>
                </div>
            </div>
        </div>
    )
}
