"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
  LogOut,
  Users,
} from "lucide-react"
import { studentDatabase, type AttendanceRecord, type AttendanceStats } from "../../lib/database-client"
import { useState, useEffect } from "react"

interface AttendanceDashboardProps {
  student: any
  onBack: () => void
  onViewOthers: () => void
  onLogout: () => void
}

export default function AttendanceDashboard({ student, onBack, onViewOthers, onLogout }: AttendanceDashboardProps) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        const [records, stats] = await Promise.all([
          studentDatabase.getStudentAttendance(student.id),
          studentDatabase.getStudentAttendanceStats(student.id),
        ])

        setAttendanceData(records)
        setAttendanceStats(stats)
      } catch (error) {
        console.error("Failed to load attendance data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAttendanceData()
  }, [student.id])

  const totalDays = attendanceStats?.totalDays || 0
  const presentDays = attendanceStats?.presentDays || 0
  const absentDays = attendanceStats?.absentDays || 0
  const attendancePercentage = attendanceStats?.attendancePercentage || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm hover:scale-110 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">My Attendance Dashboard</h1>
            <p className="text-white/90 text-lg">Track your attendance progress</p>
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

        {/* Student Info */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{student.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">{student.rollNo}</Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">{student.class}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-10 w-10" />
                <div>
                  <p className="text-sm opacity-90">Present Days</p>
                  <p className="text-3xl font-bold">{presentDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-pink-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <XCircle className="h-10 w-10" />
                <div>
                  <p className="text-sm opacity-90">Absent Days</p>
                  <p className="text-3xl font-bold">{absentDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-10 w-10" />
                <div>
                  <p className="text-sm opacity-90">Total Days</p>
                  <p className="text-3xl font-bold">{totalDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-10 w-10" />
                <div>
                  <p className="text-sm opacity-90">Attendance Rate</p>
                  <p className="text-3xl font-bold">{attendancePercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Progress */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-purple-600" />
                Attendance Progress
              </CardTitle>
              <CardDescription>Your current attendance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-semibold">Overall Attendance</span>
                  <span className="text-lg font-bold text-purple-600">{attendancePercentage}%</span>
                </div>
                <Progress value={attendancePercentage} className="h-4" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:scale-105 transition-transform">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                  <p className="text-sm text-gray-600">Present</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg hover:scale-105 transition-transform">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                  <p className="text-sm text-gray-600">Absent</p>
                </div>
              </div>

              {attendancePercentage >= 90 && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Excellent Attendance! Keep it up!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-blue-600" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Your latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceData
                  .slice(-6)
                  .reverse()
                  .map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 hover:scale-102"
                    >
                      <div className="flex items-center gap-3">
                        {record.status === "present" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{record.subject}</p>
                          <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          record.status === "present"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                        }
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
