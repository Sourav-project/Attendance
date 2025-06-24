"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  BookOpen,
  Users,
  Settings,
  Loader2,
  Minimize2,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Star,
  Zap,
  Heart,
  Smile,
  Brain,
  MagnetIcon as Magic,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useChat } from "ai/react"
import { aiDatabase, generateSessionId, categorizeQuery } from "@/lib/ai-database"

interface AIAssistantProps {
  userType?: "student" | "teacher" | "guest"
  userName?: string
  userId?: number
}

export default function AIAssistant({ userType = "guest", userName, userId }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello${userName ? ` ${userName}` : ""}! 👋 I'm your Smart Attendance Assistant. I'm here to help you with any questions about our attendance system, troubleshooting issues, or providing guidance. 

**I can help you with:**
• Marking attendance and viewing records
• Login and password issues  
• Registration and account setup
• System navigation and features
• Technical troubleshooting
• Reports and analytics

**How can I assist you today?** Just type your question below!`,
      },
    ],
    body: {
      userType,
      userName,
      userId,
      sessionId,
      systemContext: "attendance_system",
    },
    onResponse: (response) => {
      console.log("Received response:", response.status)
      if (response.ok) {
        setConnectionError(false)
        setRetryCount(0)
      }
    },
    onFinish: async (message) => {
      setIsTyping(false)
      console.log("AI response finished:", message.content.substring(0, 100) + "...")

      try {
        // Log the conversation to database
        await aiDatabase.logConversation({
          sessionId,
          userType,
          userId,
          userName,
          messageRole: "assistant",
          messageContent: message.content,
          responseTimeMs: Date.now() - responseStartTime,
          tokensUsed: message.content.length,
          modelUsed: "gpt-4o",
        })

        // Update popular topics
        if (lastUserMessage) {
          const category = categorizeQuery(lastUserMessage)
          await aiDatabase.updatePopularTopic(lastUserMessage.slice(0, 50), category)
        }
      } catch (error) {
        console.log("Database logging failed:", error)
      }
    },
    onError: (error) => {
      console.error("Chat error:", error)
      setConnectionError(true)
      setIsTyping(false)
    },
  })

  const [responseStartTime, setResponseStartTime] = useState(0)
  const [lastUserMessage, setLastUserMessage] = useState("")

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Set typing indicator when loading
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
    }
  }, [isLoading])

  const quickSuggestions = [
    {
      icon: <HelpCircle className="h-4 w-4" />,
      text: "How do I mark my attendance?",
      category: "student",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "How to view student attendance reports?",
      category: "teacher",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      text: "I forgot my password, what should I do?",
      category: "both",
      gradient: "from-green-400 to-emerald-400",
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      text: "How does the attendance system work?",
      category: "both",
      gradient: "from-orange-400 to-red-400",
    },
  ]

  const handleQuickSuggestion = async (suggestion: string) => {
    console.log("Quick suggestion clicked:", suggestion)

    // Set the input value
    handleInputChange({ target: { value: suggestion } } as any)

    // Log user message to database
    try {
      await aiDatabase.logConversation({
        sessionId,
        userType,
        userId,
        userName,
        messageRole: "user",
        messageContent: suggestion,
      })
    } catch (error) {
      console.log("Database logging failed:", error)
    }

    setLastUserMessage(suggestion)
    setResponseStartTime(Date.now())

    // Create a synthetic form event and submit
    const syntheticEvent = {
      preventDefault: () => {},
      target: { elements: { message: { value: suggestion } } },
    } as any

    handleSubmit(syntheticEvent)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    console.log("Form submitted with input:", input)

    // Log user message to database
    try {
      await aiDatabase.logConversation({
        sessionId,
        userType,
        userId,
        userName,
        messageRole: "user",
        messageContent: input,
      })
    } catch (error) {
      console.log("Database logging failed:", error)
    }

    setLastUserMessage(input)
    setResponseStartTime(Date.now())
    setConnectionError(false)

    handleSubmit(e)
  }

  const handleRetry = () => {
    console.log("Retrying last message...")
    setRetryCount((prev) => prev + 1)
    setConnectionError(false)
    reload()
  }

  const handleFeedback = async (rating: number, wasHelpful?: boolean) => {
    try {
      await aiDatabase.recordFeedback({
        sessionId,
        userType,
        userId,
        rating,
        wasHelpful,
        feedbackCategory: "general",
      })

      setFeedbackRating(rating)
      setShowFeedback(false)
      console.log(`Feedback recorded: ${rating} stars`)
    } catch (error) {
      console.log("Feedback recording failed:", error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Fallback response function
  const getFallbackResponse = (query: string) => {
    const queryLower = query.toLowerCase()

    if (queryLower.includes("attendance") || queryLower.includes("mark")) {
      return `**How to Mark Attendance:**

1. **Log in** to your student portal using your roll number and password
2. **Click** the "Mark Attendance" button on your dashboard
3. **Select** the subject/class if prompted
4. **Click** "Mark Present" to record your attendance
5. **Confirm** - you'll see a success message with timestamp

**Important Notes:**
• You can only mark attendance once per day per subject
• Make sure you're in the correct class/location
• Attendance is recorded with your current timestamp

Need help with login issues? Just ask! 😊`
    }

    if (queryLower.includes("password") || queryLower.includes("forgot") || queryLower.includes("login")) {
      return `**Password Recovery Steps:**

1. **Go to** the login page
2. **Click** "Forgot Password" link
3. **Enter** your roll number or email address
4. **Check** your email for reset instructions
5. **Follow** the link to create a new password
6. **Login** with your new credentials

**Still having trouble?**
• Check your spam/junk folder for the reset email
• Make sure you're using the correct roll number/email
• Try clearing your browser cache
• Contact your system administrator if the issue persists

I'm here to help with any other questions! 🔧`
    }

    if (queryLower.includes("register") || queryLower.includes("signup") || queryLower.includes("account")) {
      return `**Registration Process:**

**For Students:**
1. **Click** "Student Portal" on the home page
2. **Click** "Register New Student"
3. **Fill in** all required information:
   • Full name and roll number
   • Email and phone number
   • Class and section details
   • Emergency contact info
4. **Create** a secure password
5. **Submit** the form

**For Teachers:**
1. **Click** "Teacher Portal" on the home page
2. **Click** "Register New Teacher"
3. **Complete** the registration form with:
   • Personal and professional details
   • Subject specializations
   • Department information
4. **Submit** for approval

**Tips:**
• Use a strong password with letters, numbers, and symbols
• Double-check all information before submitting
• Keep your login credentials safe

Ready to get started? 🚀`
    }

    return `**I'm here to help!** 🤖

I can assist you with:
• **Attendance marking** and viewing records
• **Login issues** and password recovery
• **Registration** for new accounts
• **System navigation** and features
• **Technical troubleshooting**
• **Reports and analytics**

**Common Solutions:**
• Clear browser cache for login issues
• Use "Forgot Password" for account recovery
• Check system requirements and internet connection
• Contact support for technical problems

**What specific issue can I help you with?** Please describe your problem and I'll provide detailed step-by-step guidance! 

Type your question below and I'll give you the best solution! 💡`
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating particles around the button */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -top-4 right-2 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 -left-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1 -right-3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-300"></div>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

          {/* Rotating border effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse border-2 border-white shadow-lg">
              <div className="absolute inset-0.5 bg-white rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
        </Button>

        {/* Enhanced floating tooltip */}
        <div className="absolute bottom-20 right-0 transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          <div className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap shadow-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="font-medium">Need help? Ask me anything!</span>
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-96 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-2xl border-0 shadow-2xl transition-all duration-500 overflow-hidden ${
          isMinimized ? "h-16" : "h-[600px]"
        }`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-lg animate-bounce"></div>
        </div>

        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg relative overflow-hidden">
          {/* Header background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-45deg from-transparent via-white/10 to-transparent animate-shimmer"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <Bot className="h-7 w-7 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-lg ${
                    connectionError
                      ? "bg-gradient-to-r from-red-400 to-red-500"
                      : "bg-gradient-to-r from-green-400 to-emerald-400"
                  }`}
                >
                  <div
                    className={`absolute inset-0.5 rounded-full animate-ping opacity-75 ${
                      connectionError ? "bg-red-300" : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`absolute inset-1 rounded-full ${connectionError ? "bg-red-400" : "bg-green-400"}`}
                  ></div>
                </div>
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text">
                  AI Assistant
                </CardTitle>
                <p className="text-white/90 text-sm font-medium flex items-center gap-1">
                  <Heart className="h-3 w-3 text-pink-300 animate-pulse" />
                  {connectionError ? "Reconnecting..." : "Always here to help!"}
                  <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse delay-500" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionError && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full transition-all duration-300 hover:scale-110"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)] relative">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 relative">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={message.id} className="space-y-3">
                    <div className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "assistant" && (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20 relative">
                          <Bot className="h-5 w-5 text-white drop-shadow-sm" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] p-4 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                            : "bg-gradient-to-br from-gray-50 to-white text-gray-800 shadow-lg border border-gray-100"
                        }`}
                      >
                        {/* Message background effects */}
                        {message.role === "user" ? (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-30"></div>
                        )}

                        <div className="relative z-10">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                          <p
                            className={`text-xs mt-3 flex items-center gap-1 ${
                              message.role === "user" ? "text-white/80" : "text-gray-500"
                            }`}
                          >
                            <span>{formatTime(new Date())}</span>
                            {message.role === "assistant" && (
                              <>
                                <Zap className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs">AI Response</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20 relative">
                          <User className="h-5 w-5 text-white drop-shadow-sm" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced feedback buttons for assistant messages */}
                    {message.role === "assistant" && index > 0 && (
                      <div className="flex justify-start ml-14 gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(5, true)}
                          className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-full transition-all duration-300 hover:scale-105 border border-green-200/50"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span className="text-xs font-medium">Helpful</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(2, false)}
                          className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-300 hover:scale-105 border border-red-200/50"
                        >
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          <span className="text-xs font-medium">Not helpful</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFeedback(true)}
                          className="h-8 px-3 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-full transition-all duration-300 hover:scale-105 border border-yellow-200/50"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          <span className="text-xs font-medium">Rate</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Enhanced typing indicator */}
                {isTyping && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 relative">
                      <Brain className="h-5 w-5 text-white animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                        <Magic className="h-4 w-4 text-purple-500 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced error display with fallback response */}
                {(error || connectionError) && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-orange-700 text-sm font-medium">
                          Connection issue detected, but I can still help!
                        </p>
                      </div>
                      <Button onClick={handleRetry} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry Connection
                      </Button>
                    </div>

                    {/* Show fallback response */}
                    {lastUserMessage && (
                      <div className="flex gap-4 justify-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="max-w-[75%] p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white text-gray-800 shadow-lg border border-gray-100">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {getFallbackResponse(lastUserMessage)}
                          </p>
                          <p className="text-xs mt-3 text-gray-500 flex items-center gap-1">
                            <span>{formatTime(new Date())}</span>
                            <Zap className="h-3 w-3 text-blue-500" />
                            <span>Offline Response</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Enhanced Feedback Modal */}
            {showFeedback && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-white via-white to-gray-50 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Rate this response</h3>
                      <p className="text-gray-600 text-sm">Your feedback helps me improve!</p>
                    </div>
                    <div className="flex gap-2 justify-center mb-6">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(rating)}
                          className="p-2 hover:scale-110 transition-all duration-300"
                        >
                          <Star
                            className={`h-8 w-8 transition-all duration-300 ${
                              rating <= feedbackRating
                                ? "text-yellow-400 fill-current drop-shadow-lg scale-110"
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowFeedback(false)}
                        className="flex-1 rounded-xl border-2 hover:scale-105 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setShowFeedback(false)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl hover:scale-105 transition-all duration-300"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    Quick suggestions:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {quickSuggestions
                      .filter((s) => s.category === "both" || s.category === userType)
                      .slice(0, 3)
                      .map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickSuggestion(suggestion.text)}
                          className={`justify-start text-left h-auto p-3 hover:scale-[1.02] transition-all duration-300 rounded-xl border-2 bg-gradient-to-r ${suggestion.gradient} hover:shadow-lg group relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-white/90 group-hover:bg-white/80 transition-all duration-300"></div>
                          <div className="relative z-10 flex items-center gap-3">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${suggestion.gradient} rounded-full flex items-center justify-center shadow-sm`}
                            >
                              {suggestion.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-800">
                              {suggestion.text}
                            </span>
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Input Area */}
            <div className="p-4 border-t bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20"></div>
              <div className="relative z-10">
                <form onSubmit={handleFormSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me anything about the attendance system..."
                      className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 focus:shadow-lg pr-12"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
                <div className="flex items-center justify-center mt-3 gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        connectionError ? "bg-red-400" : "bg-green-400"
                      }`}
                    ></div>
                    <p className="text-xs text-gray-500 font-medium">
                      {connectionError ? "Offline Mode" : "Powered by AI"}
                    </p>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3 text-purple-500" />
                    <p className="text-xs text-gray-500 font-medium">Always learning</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}
