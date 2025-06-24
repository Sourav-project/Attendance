"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Search, User, CheckCircle, XCircle, LogOut, Eye, Shield } from "lucide-react"
import { studentDatabase, type AttendanceStats } from "../../lib/database-client"

// Mock student data with attendance
// const studentsWithAttendance = [
//   {
//     id: 1,
//     name: "Alice Johnson",
//     rollNo: "CS001",
//     class: "Computer Science",
//     year: "3rd Year",
//     email: "alice.johnson@university.edu",
//     presentDays: 23,
//     totalDays: 25,
//     attendanceRate: 92,
//   },
//   {
//     id: 2,
//     name: "Bob Smith",
//     rollNo: "CS002",
//     class: "Computer Science",
//     year: "3rd Year",
//     email: "bob.smith@university.edu",
//     presentDays: 20,
//     totalDays: 25,
//     attendanceRate: 80,
//   },
//   {
//     id: 3,
//     name: "Carol Davis",
//     rollNo: "CS003",
//     class: "Computer Science",
//     year: "3rd Year",
//     email: "carol.davis@university.edu",
//     presentDays: 24,
//     totalDays: 25,
//     attendanceRate: 96,
//   },
//   {
//     id: 4,
//     name: "David Wilson",
//     rollNo: "CS004",
//     class: "Computer Science",
//     year: "3rd Year",
//     email: "david.wilson@university.edu",
//     presentDays: 18,
//     totalDays: 25,
//     attendanceRate: 72,
//   },
//   {
//     id: 5,
//     name: "Emma Brown",
//     rollNo: "CS005",
//     class: "Computer Science",
//     year: "3rd Year",
//     email: "emma.brown@university.edu",
//     presentDays: 25,
//     totalDays: 25,
//     attendanceRate: 100,
//   },
// ]

interface ViewOthersAttendanceProps {
  currentUser: any
  onBack: () => void
  onLogout: () => void
}

export default function ViewOthersAttendance({ currentUser, onBack, onLogout }: ViewOthersAttendanceProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [studentsWithAttendance, setStudentsWithAttendance] = useState<AttendanceStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const stats = await studentDatabase.getAllAttendanceStats()
        setStudentsWithAttendance(stats)
      } catch (error) {
        console.error("Failed to load student attendance data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStudentData()
  }, [])

  const filteredStudents = studentsWithAttendance.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm hover:scale-110 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300">
              <Users className="h-8 w-8 text-white" />
              <h1 className="text-4xl font-bold text-white">Class Attendance</h1>
            </div>
          </div>
          <Button
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm hover:scale-110 transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Current User Info */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Viewing as: {currentUser.name}</h2>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-sm">{currentUser.rollNo}</Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-sm">
                    <Shield className="h-3 w-3 mr-1" />
                    Read-Only Access
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Search className="h-6 w-6 text-purple-600" />
              Search Students
            </CardTitle>
            <CardDescription>View attendance records of your classmates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, roll number, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg p-4 border-2 focus:border-purple-500 hover:border-purple-300 transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className={`hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-purple-300 ${
                student.id === currentUser.id
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400"
                  : "bg-gradient-to-br from-white to-gray-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      {student.studentName}
                      {student.id === currentUser.id && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">You</Badge>
                      )}
                    </h3>
                    <p className="text-gray-600">{student.rollNo}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs">{student.class}</Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">{student.year}</Badge>
                  </div>

                  {/* Attendance Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Attendance</span>
                      <span className="text-sm font-bold text-purple-600">{student.attendanceRate}%</span>
                    </div>
                    <Progress value={student.attendanceRate} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        {student.presentDays}/{student.totalDays} days
                      </span>
                      <Badge className={`bg-gradient-to-r ${getAttendanceColor(student.attendanceRate)} text-xs`}>
                        {getAttendanceStatus(student.attendanceRate)}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="text-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-green-600">{student.presentDays}</p>
                      <p className="text-xs text-gray-600">Present</p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded">
                      <XCircle className="h-4 w-4 text-red-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-red-600">{student.totalDays - student.presentDays}</p>
                      <p className="text-xs text-gray-600">Absent</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button
                    onClick={() => setSelectedStudent(student)}
                    className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm py-2 rounded-lg hover:scale-105 transition-all duration-300"
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
            <p className="text-xl text-white/80">No students found matching your search.</p>
          </div>
        )}

        {/* Selected Student Modal/Details */}
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{selectedStudent.studentName}</h3>
                  <p className="text-gray-600">{selectedStudent.rollNo}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">{selectedStudent.class}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">{selectedStudent.year}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Present Days:</span>
                    <span className="font-bold text-green-600">{selectedStudent.presentDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Days:</span>
                    <span className="font-bold">{selectedStudent.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attendance Rate:</span>
                    <span className="font-bold text-purple-600">{selectedStudent.attendanceRate}%</span>
                  </div>
                </div>

                <Progress value={selectedStudent.attendanceRate} className="h-3" />

                <Badge
                  className={`w-full justify-center bg-gradient-to-r ${getAttendanceColor(selectedStudent.attendanceRate)}`}
                >
                  {getAttendanceStatus(selectedStudent.attendanceRate)}
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
