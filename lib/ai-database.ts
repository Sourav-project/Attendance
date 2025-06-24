"use client"

export interface AIConversation {
  id: number
  sessionId: string
  userType: "student" | "teacher" | "guest"
  userId?: number
  userName?: string
  messageRole: "user" | "assistant"
  messageContent: string
  messageTimestamp: string
  responseTimeMs?: number
  tokensUsed?: number
  modelUsed: string
  createdAt: string
}

export interface AIAnalytics {
  id: number
  date: string
  totalConversations: number
  totalMessages: number
  uniqueUsers: number
  studentInteractions: number
  teacherInteractions: number
  guestInteractions: number
  avgResponseTimeMs: number
  totalTokensUsed: number
  mostCommonTopic?: string
  satisfactionScore: number
}

export interface AIKnowledgeBase {
  id: number
  question: string
  answer: string
  category: string
  userType: "student" | "teacher" | "both"
  keywords: string[]
  usageCount: number
  effectivenessScore: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AIFeedback {
  id: number
  conversationId?: number
  sessionId: string
  userType: "student" | "teacher" | "guest"
  userId?: number
  rating: number
  feedbackText?: string
  wasHelpful?: boolean
  issueResolved?: boolean
  feedbackCategory?: string
  createdAt: string
}

export interface AISettings {
  id: number
  settingKey: string
  settingValue: string
  settingType: "string" | "number" | "boolean" | "json"
  description?: string
  isActive: boolean
}

export interface AIPopularTopic {
  id: number
  topic: string
  category: string
  mentionCount: number
  lastMentioned: string
  trendingScore: number
  createdAt: string
}

export interface AIStatistics {
  totalConversations: number
  totalMessages: number
  avgResponseTime: number
  userSatisfaction: number
  topCategory: string
  dailyAverage: number
}

// Enhanced AI Database with comprehensive conversation and analytics management
class AIDatabase {
  private conversations: AIConversation[] = []
  private analytics: AIAnalytics[] = []
  private knowledgeBase: AIKnowledgeBase[] = []
  private feedback: AIFeedback[] = []
  private settings: AISettings[] = []
  private popularTopics: AIPopularTopic[] = []
  private initialized = false

  constructor() {
    this.initializeDatabase()
  }

  private async initializeDatabase() {
    if (this.initialized) return

    // Initialize AI settings
    this.settings = [
      {
        id: 1,
        settingKey: "max_response_length",
        settingValue: "500",
        settingType: "number",
        description: "Maximum number of tokens for AI responses",
        isActive: true,
      },
      {
        id: 2,
        settingKey: "response_temperature",
        settingValue: "0.7",
        settingType: "number",
        description: "AI response creativity level (0-1)",
        isActive: true,
      },
      {
        id: 3,
        settingKey: "enable_analytics",
        settingValue: "true",
        settingType: "boolean",
        description: "Enable conversation analytics tracking",
        isActive: true,
      },
      {
        id: 4,
        settingKey: "enable_feedback",
        settingValue: "true",
        settingType: "boolean",
        description: "Enable user feedback collection",
        isActive: true,
      },
      {
        id: 5,
        settingKey: "default_model",
        settingValue: "gpt-4o",
        settingType: "string",
        description: "Default AI model to use",
        isActive: true,
      },
    ]

    // Initialize knowledge base with comprehensive Q&A
    this.knowledgeBase = [
      {
        id: 1,
        question: "How do I mark my attendance?",
        answer:
          "To mark your attendance:\n1. Log in to your student portal using your roll number and password\n2. Click on 'Mark Attendance' button\n3. Select the subject/class\n4. Click 'Mark Present' - your attendance will be recorded with timestamp\n\nNote: You can only mark attendance once per day per subject.",
        category: "attendance",
        userType: "student",
        keywords: ["mark", "attendance", "present", "how to", "student"],
        usageCount: 45,
        effectivenessScore: 4.8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        question: "I forgot my password",
        answer:
          "If you forgot your password:\n1. Go to the login page\n2. Click 'Forgot Password' link\n3. Enter your roll number or email\n4. Check your email for reset instructions\n5. Follow the link to create a new password\n\nIf you still have issues, contact your system administrator.",
        category: "login",
        userType: "both",
        keywords: ["password", "forgot", "reset", "login", "help"],
        usageCount: 32,
        effectivenessScore: 4.6,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        question: "How do I view attendance reports?",
        answer:
          "To view attendance reports as a teacher:\n1. Log in to your teacher portal\n2. Go to 'Teacher Dashboard'\n3. Use search and filter options to find specific students or classes\n4. Click 'View Details' for detailed attendance records\n5. Use 'Export' to download reports\n\nYou can filter by date range, class, or subject.",
        category: "reports",
        userType: "teacher",
        keywords: ["reports", "view", "attendance", "teacher", "dashboard", "export"],
        usageCount: 28,
        effectivenessScore: 4.7,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 4,
        question: "Why is my attendance percentage low?",
        answer:
          "Your attendance percentage is calculated as: (Present Days ÷ Total Days) × 100\n\nTo improve it:\n1. Make sure to mark attendance daily\n2. Arrive on time for classes\n3. Check if you missed marking attendance on any days\n4. Contact your teacher if there are errors in your records\n\nRegular attendance is important for academic success!",
        category: "attendance",
        userType: "student",
        keywords: ["percentage", "low", "calculate", "improve", "attendance"],
        usageCount: 22,
        effectivenessScore: 4.5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        question: "How do I register as a new student?",
        answer:
          "To register as a new student:\n1. Go to the home page\n2. Click 'Student Portal'\n3. Click 'Register New Student'\n4. Fill in all required information (name, roll number, email, class, etc.)\n5. Create a secure password\n6. Submit the form\n7. You can now log in with your credentials\n\nMake sure all information is accurate!",
        category: "registration",
        userType: "student",
        keywords: ["register", "new", "student", "signup", "account"],
        usageCount: 18,
        effectivenessScore: 4.9,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 6,
        question: "How does the teacher dashboard work?",
        answer:
          "The teacher dashboard allows you to:\n1. View all student attendance records\n2. Search students by name, roll number, or class\n3. Filter by date ranges and subjects\n4. Generate attendance reports\n5. View attendance statistics and analytics\n6. Export data to Excel/PDF\n7. Manage your profile and subjects taught\n\nIt's your central hub for attendance management!",
        category: "dashboard",
        userType: "teacher",
        keywords: ["dashboard", "teacher", "features", "how to use", "management"],
        usageCount: 15,
        effectivenessScore: 4.8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    // Initialize some sample conversations for analytics
    this.conversations = [
      {
        id: 1,
        sessionId: "session_001",
        userType: "student",
        userId: 1,
        userName: "Alice Johnson",
        messageRole: "user",
        messageContent: "How do I mark my attendance?",
        messageTimestamp: new Date(Date.now() - 86400000).toISOString(),
        modelUsed: "gpt-4o",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 2,
        sessionId: "session_001",
        userType: "student",
        userId: 1,
        userName: "Alice Johnson",
        messageRole: "assistant",
        messageContent:
          "To mark your attendance, log in to your student portal and click the 'Mark Attendance' button...",
        messageTimestamp: new Date(Date.now() - 86400000 + 2000).toISOString(),
        responseTimeMs: 1200,
        tokensUsed: 85,
        modelUsed: "gpt-4o",
        createdAt: new Date(Date.now() - 86400000 + 2000).toISOString(),
      },
    ]

    // Initialize analytics
    this.analytics = [
      {
        id: 1,
        date: new Date().toISOString().split("T")[0],
        totalConversations: 12,
        totalMessages: 28,
        uniqueUsers: 8,
        studentInteractions: 7,
        teacherInteractions: 4,
        guestInteractions: 1,
        avgResponseTimeMs: 1150,
        totalTokensUsed: 2340,
        mostCommonTopic: "attendance",
        satisfactionScore: 4.6,
      },
    ]

    // Initialize popular topics
    this.popularTopics = [
      {
        id: 1,
        topic: "mark attendance",
        category: "attendance",
        mentionCount: 15,
        lastMentioned: new Date().toISOString(),
        trendingScore: 8.5,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: 2,
        topic: "forgot password",
        category: "login",
        mentionCount: 12,
        lastMentioned: new Date(Date.now() - 3600000).toISOString(),
        trendingScore: 7.2,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ]

    this.initialized = true
    console.log("AI Database initialized with comprehensive data")
  }

  // Log conversation messages
  async logConversation(data: {
    sessionId: string
    userType: "student" | "teacher" | "guest"
    userId?: number
    userName?: string
    messageRole: "user" | "assistant"
    messageContent: string
    responseTimeMs?: number
    tokensUsed?: number
    modelUsed?: string
  }): Promise<number> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const newConversation: AIConversation = {
          id: Math.max(...this.conversations.map((c) => c.id), 0) + 1,
          sessionId: data.sessionId,
          userType: data.userType,
          userId: data.userId,
          userName: data.userName,
          messageRole: data.messageRole,
          messageContent: data.messageContent,
          messageTimestamp: new Date().toISOString(),
          responseTimeMs: data.responseTimeMs,
          tokensUsed: data.tokensUsed,
          modelUsed: data.modelUsed || "gpt-4o",
          createdAt: new Date().toISOString(),
        }

        this.conversations.push(newConversation)
        console.log(`Logged AI conversation: ${data.messageRole} message from ${data.userType}`)
        resolve(newConversation.id)
      }, 50)
    })
  }

  // Search knowledge base for relevant answers
  async searchKnowledgeBase(
    query: string,
    userType: "student" | "teacher" | "both" = "both",
    limit = 5,
  ): Promise<AIKnowledgeBase[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const queryLower = query.toLowerCase()
        const queryWords = queryLower.split(" ").filter((word) => word.length > 2)

        const results = this.knowledgeBase
          .filter((kb) => kb.isActive && (kb.userType === userType || kb.userType === "both"))
          .map((kb) => {
            let relevanceScore = 0

            // Check keyword matches
            const keywordMatches = kb.keywords.filter((keyword) =>
              queryWords.some((word) => keyword.toLowerCase().includes(word)),
            ).length
            relevanceScore += keywordMatches * 2

            // Check question similarity
            if (kb.question.toLowerCase().includes(queryLower)) relevanceScore += 3
            queryWords.forEach((word) => {
              if (kb.question.toLowerCase().includes(word)) relevanceScore += 1
            })

            // Check answer similarity
            queryWords.forEach((word) => {
              if (kb.answer.toLowerCase().includes(word)) relevanceScore += 0.5
            })

            return { ...kb, relevanceScore }
          })
          .filter((kb) => kb.relevanceScore > 0)
          .sort((a, b) => b.relevanceScore - a.relevanceScore || b.effectivenessScore - a.effectivenessScore)
          .slice(0, limit)

        console.log(`Found ${results.length} relevant knowledge base entries for: "${query}"`)
        resolve(results)
      }, 100)
    })
  }

  // Record user feedback
  async recordFeedback(data: {
    sessionId: string
    userType: "student" | "teacher" | "guest"
    userId?: number
    rating: number
    feedbackText?: string
    wasHelpful?: boolean
    issueResolved?: boolean
    feedbackCategory?: string
  }): Promise<number> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const newFeedback: AIFeedback = {
          id: Math.max(...this.feedback.map((f) => f.id), 0) + 1,
          sessionId: data.sessionId,
          userType: data.userType,
          userId: data.userId,
          rating: data.rating,
          feedbackText: data.feedbackText,
          wasHelpful: data.wasHelpful,
          issueResolved: data.issueResolved,
          feedbackCategory: data.feedbackCategory,
          createdAt: new Date().toISOString(),
        }

        this.feedback.push(newFeedback)
        console.log(`Recorded AI feedback: ${data.rating} stars from ${data.userType}`)
        resolve(newFeedback.id)
      }, 50)
    })
  }

  // Update popular topics
  async updatePopularTopic(topic: string, category: string): Promise<void> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const existingTopic = this.popularTopics.find((t) => t.topic === topic && t.category === category)

        if (existingTopic) {
          existingTopic.mentionCount += 1
          existingTopic.lastMentioned = new Date().toISOString()
          existingTopic.trendingScore = existingTopic.mentionCount * 0.1 + Math.random() * 2
        } else {
          const newTopic: AIPopularTopic = {
            id: Math.max(...this.popularTopics.map((t) => t.id), 0) + 1,
            topic,
            category,
            mentionCount: 1,
            lastMentioned: new Date().toISOString(),
            trendingScore: 1.0,
            createdAt: new Date().toISOString(),
          }
          this.popularTopics.push(newTopic)
        }

        console.log(`Updated popular topic: ${topic} in ${category}`)
        resolve()
      }, 50)
    })
  }

  // Get AI statistics
  async getStatistics(days = 30): Promise<AIStatistics> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const cutoffDate = new Date(Date.now() - days * 86400000)
        const recentConversations = this.conversations.filter((c) => new Date(c.messageTimestamp) >= cutoffDate)

        const uniqueSessions = new Set(recentConversations.map((c) => c.sessionId)).size
        const assistantMessages = recentConversations.filter((c) => c.messageRole === "assistant")
        const avgResponseTime =
          assistantMessages.reduce((sum, c) => sum + (c.responseTimeMs || 0), 0) / assistantMessages.length || 0

        const recentFeedback = this.feedback.filter((f) => new Date(f.createdAt) >= cutoffDate)
        const avgRating = recentFeedback.reduce((sum, f) => sum + f.rating, 0) / recentFeedback.length || 0

        const topCategory =
          this.popularTopics.sort((a, b) => b.trendingScore - a.trendingScore)[0]?.category || "general"

        const stats: AIStatistics = {
          totalConversations: uniqueSessions,
          totalMessages: recentConversations.length,
          avgResponseTime,
          userSatisfaction: Math.round(avgRating * 100) / 100,
          topCategory,
          dailyAverage: Math.round((uniqueSessions / days) * 100) / 100,
        }

        resolve(stats)
      }, 100)
    })
  }

  // Get conversation history for a session
  async getConversationHistory(sessionId: string): Promise<AIConversation[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const history = this.conversations
          .filter((c) => c.sessionId === sessionId)
          .sort((a, b) => new Date(a.messageTimestamp).getTime() - new Date(b.messageTimestamp).getTime())

        resolve(history)
      }, 50)
    })
  }

  // Get analytics data
  async getAnalytics(days = 7): Promise<AIAnalytics[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const cutoffDate = new Date(Date.now() - days * 86400000)
        const recentAnalytics = this.analytics.filter((a) => new Date(a.date) >= cutoffDate)

        resolve(recentAnalytics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }, 50)
    })
  }

  // Get popular topics
  async getPopularTopics(limit = 10): Promise<AIPopularTopic[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const topics = this.popularTopics.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit)

        resolve(topics)
      }, 50)
    })
  }

  // Get AI settings
  async getSettings(): Promise<AISettings[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.settings.filter((s) => s.isActive))
      }, 50)
    })
  }

  // Update AI setting
  async updateSetting(key: string, value: string): Promise<boolean> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const setting = this.settings.find((s) => s.settingKey === key)
        if (setting) {
          setting.settingValue = value
          console.log(`Updated AI setting: ${key} = ${value}`)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 50)
    })
  }
}

// Export singleton instance
export const aiDatabase = new AIDatabase()

// Export utility functions
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const categorizeQuery = (query: string): string => {
  const queryLower = query.toLowerCase()

  if (queryLower.includes("attendance") || queryLower.includes("mark") || queryLower.includes("present")) {
    return "attendance"
  }
  if (queryLower.includes("password") || queryLower.includes("login") || queryLower.includes("forgot")) {
    return "login"
  }
  if (queryLower.includes("register") || queryLower.includes("signup") || queryLower.includes("account")) {
    return "registration"
  }
  if (queryLower.includes("report") || queryLower.includes("dashboard") || queryLower.includes("view")) {
    return "reports"
  }
  if (queryLower.includes("teacher") || queryLower.includes("student") || queryLower.includes("profile")) {
    return "profile"
  }
  if (queryLower.includes("help") || queryLower.includes("how") || queryLower.includes("what")) {
    return "help"
  }

  return "general"
}

export const extractKeywords = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 10)
}
