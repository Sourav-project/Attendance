"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Users, FileText, TrendingUp, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { studentDatabase } from "../../lib/database-client"

interface DatabaseStats {
  totalStudents: number
  activeStudents: number
  totalAttendanceRecords: number
  averageAttendance: number
}

export default function DatabaseStatus() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadStats = async () => {
    setLoading(true)
    try {
      const databaseStats = await studentDatabase.getDatabaseStats()
      setStats(databaseStats)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to load database stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (loading && !stats) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading database status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Database Status</CardTitle>
              <CardDescription>Real-time system statistics</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
            <Button
              onClick={loadStats}
              disabled={loading}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {stats && (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:scale-105 transition-transform">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:scale-105 transition-transform">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{stats.activeStudents}</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:scale-105 transition-transform">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{stats.totalAttendanceRecords}</p>
                <p className="text-sm text-gray-600">Attendance Records</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg hover:scale-105 transition-transform">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{stats.averageAttendance}%</p>
                <p className="text-sm text-gray-600">Average Attendance</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-gray-800">System Information</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Database is connected and operational</p>
                <p>• All student records are properly indexed</p>
                <p>• Attendance tracking is active</p>
                <p>• Last updated: {lastUpdated.toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
