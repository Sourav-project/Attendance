"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  BarChart3,
  User,
  LogOut,
  Users,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { studentDatabase } from "../../lib/database-client"

interface MarkAttendanceProps {
  student: any
  onViewDashboard: () => void
  onViewOthers: () => void
  onLogout: () => void
}

export default function MarkAttendance({ student, onViewDashboard, onViewOthers, onLogout }: MarkAttendanceProps) {
  const [isMarked, setIsMarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAttendance = async () => {
    setIsLoading(true)

    try {
      const today = new Date().toISOString().split("T")[0]
      const currentSubject = "General Class" // You can make this dynamic

      await studentDatabase.markAttendance(student.id, today, currentSubject, "Room 101")

      console.log(`Attendance marked for ${student.name} on ${today}`)
      setIsMarked(true)
    } catch (error) {
      console.error("Failed to mark attendance:", error)
      // You could add error handling here
    }

    setIsLoading(false)
  }

  const currentTime = new Date().toLocaleTimeString()
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300">
              <Shield className="h-8 w-8 text-white" />
              <h1 className="text-4xl font-bold text-white">My Attendance</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onViewOthers}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm hover:scale-110 transition-all duration-300"
            >
              <Users className="h-4 w-4 mr-2" />
              View Others
            </Button>
            <Button
              onClick={onLogout}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm hover:scale-110 transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <Alert className="mb-6 border-yellow-200 bg-yellow-50/95 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Security Notice:</strong> You can only mark attendance for your own account. This ensures accurate
            and secure attendance tracking.
          </AlertDescription>
        </Alert>

        {/* Current Date */}
        <div className="text-center mb-8">
          <p className="text-white/90 text-xl font-semibold">{currentDate}</p>
        </div>

        {/* Student Info Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8 hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{student.name}</h2>
                <div className="flex gap-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-lg px-4 py-2">
                    {student.rollNo}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-lg px-4 py-2">
                    {student.class}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-lg px-4 py-2">
                    {student.year}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-lg px-4 py-2">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Current Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:scale-105 transition-transform">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:scale-105 transition-transform">
                <Clock className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold text-gray-800">{currentTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:scale-105 transition-transform">
                <MapPin className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">Room 101</p>
                </div>
              </div>
            </div>

            {/* Attendance Button */}
            <div className="text-center">
              {!isMarked ? (
                <Button
                  onClick={handleMarkAttendance}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl px-12 py-6 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-6 w-6 mr-3 animate-spin" />
                      Marking Your Attendance...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 mr-3" />
                      Mark My Attendance
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-xl animate-pulse">
                    <CheckCircle className="h-8 w-8" />
                    Your Attendance Marked Successfully!
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={onViewDashboard}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300"
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      My Dashboard
                    </Button>
                    <Button
                      onClick={onViewOthers}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      View Others
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">23</h3>
              <p className="text-gray-600">My Present Days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">92%</h3>
              <p className="text-gray-600">My Attendance Rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">25</h3>
              <p className="text-gray-600">Total Days</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
