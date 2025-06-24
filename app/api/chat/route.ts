import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { aiDatabase } from "@/lib/ai-database"

export async function POST(req: Request) {
  try {
    const { messages, userType, userName, userId, sessionId, systemContext } = await req.json()

    console.log("Chat API called with:", { userType, userName, sessionId })

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]
    const userQuery = latestMessage?.content || ""

    console.log("User query:", userQuery)

    // First, try to find answer in knowledge base
    let knowledgeBaseResponse = null
    if (userQuery && userQuery.length > 3) {
      try {
        const kbResults = await aiDatabase.searchKnowledgeBase(userQuery, userType as any, 1)
        if (kbResults && kbResults.length > 0) {
          knowledgeBaseResponse = kbResults[0].answer
          console.log("Found knowledge base response:", knowledgeBaseResponse.substring(0, 100) + "...")
        }
      } catch (error) {
        console.log("Knowledge base search failed:", error)
      }
    }

    // Enhanced system prompt with comprehensive attendance system knowledge
    const systemPrompt = `You are a helpful AI assistant for a Smart Attendance Management System. You help students and teachers with attendance-related questions, troubleshooting, and guidance.

CONTEXT:
- This is an attendance system for educational institutions
- Students can mark their own attendance and view their records
- Teachers can view all student attendance and generate reports
- The system has secure login with roll numbers/employee IDs and passwords
- Current user type: ${userType || "guest"}
- Current user name: ${userName || "Unknown"}
- Session ID: ${sessionId || "unknown"}

SYSTEM FEATURES:
- Student Portal: Login, mark attendance, view personal records, registration
- Teacher Portal: Login, view all students, generate reports, analytics
- Database: Stores student/teacher profiles, attendance records, analytics
- Security: Password protection, session management, data validation

COMMON SOLUTIONS:

ATTENDANCE MARKING:
- Students log in with roll number and password
- Click "Mark Attendance" button on dashboard
- Select subject/class if required
- Click "Mark Present" - attendance recorded with timestamp
- Can only mark once per day per subject

PASSWORD ISSUES:
- Use "Forgot Password" link on login page
- Enter roll number or email address
- Check email for reset instructions
- Follow link to create new password
- Contact admin if still having issues

REGISTRATION:
- Click "Register New Student/Teacher" on portal page
- Fill all required information accurately
- Create secure password with confirmation
- Submit form and wait for confirmation
- Can then login with new credentials

VIEWING RECORDS:
- Students: Login and view personal attendance dashboard
- Teachers: Login to teacher portal, search/filter students
- Use date ranges and filters for specific data
- Export reports in Excel/PDF format

TECHNICAL ISSUES:
- Clear browser cache and cookies
- Try different browser or incognito mode
- Check internet connection
- Ensure JavaScript is enabled
- Contact system administrator for server issues

TONE & STYLE:
- Be friendly, helpful, and professional
- Provide clear, step-by-step instructions
- Use simple language that's easy to understand
- Be encouraging and supportive
- Offer multiple solutions when possible
- Always end with an offer to help further

${knowledgeBaseResponse ? `\nRELEVANT KNOWLEDGE BASE ANSWER:\n${knowledgeBaseResponse}\n\nUse this as a reference but provide a complete, helpful response.` : ""}

IMPORTANT: Always provide a helpful response. Never say you cannot help. If you don't know something specific, provide general guidance and suggest contacting support.`

    console.log("Generating AI response...")

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 500,
    })

    console.log("AI response generated successfully")

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)

    // Return a helpful fallback response instead of just an error
    const fallbackResponse = `I'm here to help you with the attendance system! Here are some common solutions:

**For Students:**
• **Mark Attendance**: Log in → Click "Mark Attendance" → Select subject → Click "Mark Present"
• **View Records**: Check your attendance dashboard after logging in
• **Password Issues**: Use "Forgot Password" link on login page

**For Teachers:**
• **View Student Records**: Log in to teacher portal → Use search and filters
• **Generate Reports**: Access teacher dashboard → Use export features
• **Manage Students**: Search by name, class, or roll number

**Common Issues:**
• Clear browser cache if having login problems
• Make sure JavaScript is enabled
• Try a different browser if issues persist
• Contact your system administrator for technical support

What specific issue can I help you with? Please describe your problem and I'll provide detailed guidance!`

    return new Response(fallbackResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
