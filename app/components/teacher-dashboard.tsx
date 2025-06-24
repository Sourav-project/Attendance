"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Users,
  Search,
  User,
  CheckCircle,
  XCircle,
  LogOut,
  Eye,
  BarChart3,
  GraduationCap,
  TrendingUp,
  Clock,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { studentDatabase, type AttendanceStats } from "../../lib/database-client"
import type { Teacher } from "../../lib/teacher-database"

interface TeacherDashboardProps {
  teacher: Teacher
  onLogout: () => void
}

export default function TeacherDashboard({ teacher, onLogout }: TeacherDashboardProps) {
  /* ------------------------------ state ------------------------------ */
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<AttendanceStats | null>(null)
  const [studentsWithAttendance, setStudentsWithAttendance] = useState<AttendanceStats[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState<string>("all")
  const [filterYear, setFilterYear] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")

  /* -------------------------- load / refresh ------------------------- */
  useEffect(() => {
    refreshData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshData() {
    setLoading(true)
    try {
      const [stats] = await Promise.all([studentDatabase.getAllAttendanceStats()])
      setStudentsWithAttendance(stats)
    } catch (err) {
      console.error("Failed loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  /* --------------------------- helpers --------------------------- */
  const filteredStudents = studentsWithAttendance
    .filter((s) => {
      const matchesSearch =
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass = filterClass === "all" || s.class === filterClass
      const matchesYear = filterYear === "all" || s.year === filterYear
      return matchesSearch && matchesClass && matchesYear
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.studentName.localeCompare(b.studentName)
        case "rollNo":
          return a.rollNo.localeCompare(b.rollNo)
        case "attendance":
          return b.attendancePercentage - a.attendancePercentage
        case "class":
          return a.class.localeCompare(b.class)
        default:
          return 0
      }
    })

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "from-green-500 to-emerald-500"
    if (rate >= 75) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 90) return "Excellent"
    if (rate >= 75) return "Good"
    return "Needs Improvement"
  }

  /* ----------------------- calculated stats ---------------------- */
  const totalStudents = studentsWithAttendance.length
  const excellentAttendance = studentsWithAttendance.filter((s) => s.attendancePercentage >= 90).length
  const goodAttendance = studentsWithAttendance.filter((s) => s.attendancePercentage >= 75).length
  const averageAttendance =
    totalStudents > 0
      ? Math.round(studentsWithAttendance.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents)
      : 0

  const uniqueClasses = [...new Set(studentsWithAttendance.map((s) => s.class))]
  const uniqueYears = [...new Set(studentsWithAttendance.map((s) => s.year))]

  /* ------------------------------- UI ------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300">
            <GraduationCap className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-white/90">Welcome, {teacher.name}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={refreshData}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm hover:scale-110 transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
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

        {/* ---------- Teacher Info ---------- */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{teacher.name}</h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">{teacher.employeeId}</Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">{teacher.department}</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {teacher.subjects.length} Subject{teacher.subjects.length !== 1 ? "s" : ""}
                  </Badge>
                  {teacher.qualification && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500">{teacher.qualification}</Badge>
                  )}
                  {teacher.experience && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                      {teacher.experience} Experience
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{teacher.email}</p>
                {teacher.phone && <p className="text-gray-500 text-sm">{teacher.phone}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- Stats Cards ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} bg="from-blue-500 to-cyan-500" label="Total Students" value={totalStudents} />
          <StatCard
            icon={CheckCircle}
            bg="from-green-500 to-emerald-500"
            label="Excellent Attendance"
            value={excellentAttendance}
          />
          <StatCard icon={Clock} bg="from-yellow-500 to-orange-500" label="Good Attendance" value={goodAttendance} />
          <StatCard
            icon={TrendingUp}
            bg="from-purple-500 to-pink-500"
            label="Average Attendance"
            value={`${averageAttendance}%`}
          />
        </div>

        {/* ---------- Tabs ---------- */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="students" className="data-[state=active]:bg-white/30">
              <Users className="h-4 w-4 mr-2" />
              Student Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white/30">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* ---------- Students Tab ---------- */}
          <TabsContent value="students" className="space-y-6">
            {/* Search / Filters */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-6 w-6 text-emerald-600" />
                  Student Search & Filters
                </CardTitle>
                <CardDescription>Search and filter students by various criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                    />
                  </div>

                  {/* Class Filter */}
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="h-12 border-2 focus:border-emerald-500 hover:border-emerald-300">
                      <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {uniqueClasses.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Year Filter */}
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="h-12 border-2 focus:border-emerald-500 hover:border-emerald-300">
                      <SelectValue placeholder="Filter by year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 border-2 focus:border-emerald-500 hover:border-emerald-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="rollNo">Sort by Roll No</SelectItem>
                      <SelectItem value="attendance">Sort by Attendance</SelectItem>
                      <SelectItem value="class">Sort by Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card
                  key={student.studentId}
                  className="hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-emerald-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{student.studentName}</h3>
                        <p className="text-gray-600">{student.rollNo}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs">{student.class}</Badge>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">{student.year}</Badge>
                      </div>

                      {/* Attendance */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Attendance</span>
                          <span className="text-sm font-bold text-emerald-600">{student.attendancePercentage}%</span>
                        </div>
                        <Progress value={student.attendancePercentage} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>
                            {student.presentDays}/{student.totalDays} days
                          </span>
                          <Badge
                            className={`bg-gradient-to-r ${getAttendanceColor(student.attendancePercentage)} text-xs`}
                          >
                            {getAttendanceStatus(student.attendancePercentage)}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <StatsMini icon={CheckCircle} color="green" label="Present" value={student.presentDays} />
                        <StatsMini icon={XCircle} color="red" label="Absent" value={student.absentDays} />
                      </div>

                      {/* View Details */}
                      <Button
                        onClick={() => setSelectedStudent(student)}
                        className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm py-2 rounded-lg hover:scale-105 transition-all duration-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <p className="text-xl text-white/80">No students found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          {/* ---------- Analytics Tab ---------- */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                  Attendance Analytics
                </CardTitle>
                <CardDescription>Comprehensive attendance statistics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Distribution */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Attendance Distribution</h3>
                    <DistributionRow label="Excellent (90%+)" color="green" count={excellentAttendance} />
                    <DistributionRow
                      label="Good (75-89%)"
                      color="yellow"
                      count={goodAttendance - excellentAttendance}
                    />
                    <DistributionRow
                      label="Needs Improvement (<75%)"
                      color="red"
                      count={totalStudents - goodAttendance}
                    />
                  </div>

                  {/* Class-wise */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Class-wise Performance</h3>
                    {uniqueClasses.map((c) => {
                      const classStudents = studentsWithAttendance.filter((s) => s.class === c)
                      const classAverage =
                        classStudents.length > 0
                          ? Math.round(
                              classStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / classStudents.length,
                            )
                          : 0
                      return (
                        <div key={c} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{c}</span>
                            <span className="text-sm font-bold text-emerald-600">{classAverage}%</span>
                          </div>
                          <Progress value={classAverage} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">{classStudents.length} students</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Reports Tab ---------- */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  Attendance Reports
                </CardTitle>
                <CardDescription>Generate and download attendance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Available Reports</h3>
                    <ReportButton label="Download All Students Report" gradient="from-blue-500 to-cyan-500" />
                    <ReportButton label="Download Low Attendance Report" gradient="from-green-500 to-emerald-500" />
                    <ReportButton label="Download Class-wise Report" gradient="from-purple-500 to-pink-500" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quick Statistics</h3>
                    <QuickStat color="blue" label="Total Students Registered" value={totalStudents} />
                    <QuickStat color="green" label="Students with Good Attendance" value={goodAttendance} />
                    <QuickStat color="orange" label="Overall Average Attendance" value={`${averageAttendance}%`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ---------- Modal ---------- */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white max-w-md w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedStudent.studentName} - Detailed View</span>
                  <Button onClick={() => setSelectedStudent(null)} variant="ghost" className="hover:bg-gray-100">
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{selectedStudent.studentName}</h3>
                  <p className="text-gray-600">{selectedStudent.rollNo}</p>
                </div>

                <div className="space-y-3">
                  <DetailRow label="Class" value={selectedStudent.class} color="blue" />
                  <DetailRow label="Year" value={selectedStudent.year} color="green" />

                  <DetailRow label="Present Days" value={selectedStudent.presentDays} color="green" strong />
                  <DetailRow label="Total Days" value={selectedStudent.totalDays} strong />
                  <DetailRow
                    label="Attendance Rate"
                    value={`${selectedStudent.attendancePercentage}%`}
                    color="emerald"
                    strong
                  />
                </div>

                <Progress value={selectedStudent.attendancePercentage} className="h-3" />

                <Badge
                  className={`w-full justify-center bg-gradient-to-r ${getAttendanceColor(
                    selectedStudent.attendancePercentage,
                  )}`}
                >
                  {getAttendanceStatus(selectedStudent.attendancePercentage)}
                </Badge>

                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                    <Eye className="h-4 w-4 mr-2" />
                    View Detailed History
                  </Button>
                  <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* -------------------- Reusable Small Components -------------------- */
/* ------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  bg,
  label,
  value,
}: {
  icon: typeof Users
  bg: string
  label: string
  value: number | string
}) {
  return (
    <Card
      className={`bg-gradient-to-r ${bg} border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Icon className="h-10 w-10" />
          <div>
            <p className="text-sm opacity-90">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatsMini({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Users
  color: string
  label: string
  value: number
}) {
  return (
    <div className={`text-center p-2 bg-${color}-50 rounded`}>
      <Icon className={`h-4 w-4 text-${color}-600 mx-auto mb-1`} />
      <p className={`text-sm font-bold text-${color}-600`}>{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  )
}

function DistributionRow({
  label,
  color,
  count,
}: {
  label: string
  color: string
  count: number
}) {
  return (
    <div className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg`}>
      <span className={`font-medium text-${color}-800`}>{label}</span>
      <Badge className={`bg-${color}-500`}>{count} students</Badge>
    </div>
  )
}

function ReportButton({ label, gradient }: { label: string; gradient: string }) {
  return (
    <Button className={`w-full justify-start bg-gradient-to-r ${gradient} hover:saturate-150`}>
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}

function QuickStat({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: number | string
}) {
  return (
    <div className={`p-3 bg-${color}-50 rounded-lg`}>
      <p className={`text-sm text-${color}-600`}>{label}</p>
      <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
    </div>
  )
}

function DetailRow({
  label,
  value,
  color,
  strong,
}: {
  label: string
  value: React.ReactNode
  color?: string
  strong?: boolean
}) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span
        className={strong ? `font-bold ${color ? `text-${color}-600` : ""}` : `${color ? `text-${color}-600` : ""}`}
      >
        {value}
      </span>
    </div>
  )
}
