"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  GraduationCap,
  Users,
  Shield,
  BarChart3,
  Clock,
  Star,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import AIAssistant from "./ai-assistant"

interface PortalSelectionProps {
  onSelectStudent: () => void
  onSelectTeacher: () => void
}

export default function PortalSelection({ onSelectStudent, onSelectTeacher }: PortalSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl animate-bounce delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-1/4 animate-float">
          <Star className="h-8 w-8 text-white/30" />
        </div>
        <div className="absolute top-48 right-1/3 animate-float delay-1000">
          <Award className="h-6 w-6 text-white/25" />
        </div>
        <div className="absolute bottom-40 left-1/5 animate-float delay-500">
          <Sparkles className="h-7 w-7 text-white/20" />
        </div>
        <div className="absolute top-60 right-1/5 animate-float delay-1500">
          <CheckCircle className="h-5 w-5 text-white/30" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="w-full max-w-6xl">
          {/* Enhanced Header with Rotating Gradient Animation */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-6 sm:mb-8 relative">
              {/* Rotating Gradient Background */}
              <div className="absolute inset-0 rounded-2xl animate-rotating-gradient opacity-80"></div>

              {/* Content Container */}
              <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl px-4 sm:px-6 lg:px-10 py-4 sm:py-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="relative">
                  <BookOpen className="h-8 w-8 sm:h-10 lg:h-12 text-white drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                    Smart Attendance
                  </h1>
                  <p className="text-sm sm:text-lg lg:text-xl text-white/90 font-medium mt-1 sm:mt-2">
                    Management System
                  </p>
                </div>
              </div>
            </div>
            <p className="text-white/90 text-base sm:text-lg lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed px-4">
              Experience the future of attendance tracking with our intelligent, secure, and user-friendly platform
            </p>
            <div className="flex justify-center gap-2 mt-4 sm:mt-6">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          {/* Enhanced Portal Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto px-2 sm:px-0">
            {/* Student Portal Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden">
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
              <div className="absolute inset-[2px] rounded-lg bg-white/10 backdrop-blur-xl"></div>

              <CardHeader className="text-center pb-6 relative z-10">
                <div className="relative mx-auto mb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                    <Users className="h-14 w-14 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Star className="h-4 w-4 text-yellow-800" />
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
                  Student Portal
                </CardTitle>
                <CardDescription className="text-white/80 text-base sm:text-lg font-medium px-2 sm:px-0">
                  Your gateway to seamless attendance tracking and academic progress
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 relative z-10">
                {/* Enhanced Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-base sm:text-lg block">
                        Secure Personal Tracking
                      </span>
                      <p className="text-white/70 text-xs sm:text-sm">
                        Your data is protected with enterprise-grade security
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-base sm:text-lg block">Smart Analytics</span>
                      <p className="text-white/70 text-xs sm:text-sm">
                        Detailed insights into your attendance patterns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-base sm:text-lg block">Real-time Updates</span>
                      <p className="text-white/70 text-xs sm:text-sm">
                        Instant attendance marking and live notifications
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Access Button */}
                <Button
                  onClick={onSelectStudent}
                  className="w-full h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg sm:text-xl font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-white/20 hover:border-white/30 group/btn"
                >
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 mr-2 sm:mr-3 group-hover/btn:animate-bounce" />
                  <span className="truncate">Enter Student Portal</span>
                  <div className="ml-2 sm:ml-3 w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                </Button>

                {/* Demo Info with Enhanced Design */}
                <div className="p-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-300/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-purple-200 font-bold text-lg">Try Demo Access</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-purple-100">
                      <span className="font-semibold">Roll No:</span> CS001-CS005 |{" "}
                      <span className="font-semibold">Password:</span> [name]123
                    </p>
                    <p className="text-purple-100/80 text-xs">
                      Experience our platform with pre-loaded student profiles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Portal Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden">
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
              <div className="absolute inset-[2px] rounded-lg bg-white/10 backdrop-blur-xl"></div>

              <CardHeader className="text-center pb-6 relative z-10">
                <div className="relative mx-auto mb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                    <GraduationCap className="h-14 w-14 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce delay-300">
                    <Award className="h-4 w-4 text-yellow-800" />
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent mb-3">
                  Teacher Portal
                </CardTitle>
                <CardDescription className="text-white/80 text-base sm:text-lg font-medium px-2 sm:px-0">
                  Comprehensive tools for managing student attendance and academic insights
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 relative z-10">
                {/* Enhanced Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-base sm:text-lg block">
                        Complete Student Overview
                      </span>
                      <p className="text-white/70 text-xs sm:text-sm">
                        Monitor all students with advanced filtering options
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-base sm:text-lg block">Advanced Analytics</span>
                      <p className="text-white/70 text-xs sm:text-sm">Generate comprehensive reports and insights</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-base sm:text-lg block">
                        Administrative Control
                      </span>
                      <p className="text-white/70 text-xs sm:text-sm">
                        Secure access with comprehensive management tools
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Access Button */}
                <Button
                  onClick={onSelectTeacher}
                  className="w-full h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg sm:text-xl font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-white/20 hover:border-white/30 group/btn"
                >
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 mr-2 sm:mr-3 group-hover/btn:animate-bounce" />
                  <span className="truncate">Enter Teacher Portal</span>
                  <div className="ml-2 sm:ml-3 w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                </Button>

                {/* Demo Info with Enhanced Design */}
                <div className="p-5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-300/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-emerald-200 font-bold text-lg">Demo Faculty Access</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-emerald-100">
                      <span className="font-semibold">Employee ID:</span> T001-T005 |{" "}
                      <span className="font-semibold">Password:</span> teacher123
                    </p>
                    <p className="text-emerald-100/80 text-xs">Explore comprehensive teacher dashboard and analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 hover:bg-white/15 transition-all duration-300">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
              <p className="text-white/90 text-lg font-medium">Created with ❤️ by Sourav</p>
              <Sparkles className="h-5 w-5 text-white animate-pulse delay-500" />
            </div>
            <p className="text-white/70 text-base">Empowering Education Through Innovation</p>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant userType="guest" />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes rotating-gradient {
          0% {
            background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc, #e879f9, #f472b6, #fb7185, #fbbf24, #34d399, #60a5fa, #8b5cf6);
            background-size: 400% 400%;
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background: linear-gradient(135deg, #f472b6, #fb7185, #fbbf24, #34d399, #60a5fa, #8b5cf6, #a855f7, #c084fc, #e879f9, #f472b6);
            background-size: 400% 400%;
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background: linear-gradient(225deg, #34d399, #60a5fa, #8b5cf6, #a855f7, #c084fc, #e879f9, #f472b6, #fb7185, #fbbf24, #34d399);
            background-size: 400% 400%;
            background-position: 0% 50%;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-rotating-gradient {
          animation: rotating-gradient 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
