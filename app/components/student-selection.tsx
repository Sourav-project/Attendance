"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle, Clock, User, BookOpen, LogOut, Search } from "lucide-react"
import type { User as UserType } from "../page"

// Mock student data (same as before but with more students)
const allStudents: UserType[] = [
  {
    id: 1,
    name: "Alice Johnson",
    rollNo: "CS001",
    class: "Computer Science",
    year: "3rd Year",
    email: "alice.johnson@university.edu",
  },
  {
    id: 2,
    name: "Bob Smith",
    rollNo: "CS002",
    class: "Computer Science",
    year: "3rd Year",
    email: "bob.smith@university.edu",
  },
  {
    id: 3,
    name: "Carol Davis",
    rollNo: "CS003",
    class: "Computer Science",
    year: "3rd Year",
    email: "carol.davis@university.edu",
  },
  {
    id: 4,
    name: "David Wilson",
    rollNo: "CS004",
    class: "Computer Science",
    year: "3rd Year",
    email: "david.wilson@university.edu",
  },
  {
    id: 5,
    name: "Emma Brown",
    rollNo: "CS005",
    class: "Computer Science",
    year: "3rd Year",
    email: "emma.brown@university.edu",
  },
  {
    id: 6,
    name: "Frank Miller",
    rollNo: "CS006",
    class: "Computer Science",
    year: "2nd Year",
    email: "frank.miller@university.edu",
  },
  {
    id: 7,
    name: "Grace Lee",
    rollNo: "CS007",
    class: "Computer Science",
    year: "2nd Year",
    email: "grace.lee@university.edu",
  },
  {
    id: 8,
    name: "Henry Taylor",
    rollNo: "CS008",
    class: "Computer Science",
    year: "1st Year",
    email: "henry.taylor@university.edu",
  },
]

interface StudentSelectionProps {
  authenticatedUser: UserType
  onStudentSelect: (student: UserType) => void
  onLogout: () => void
}

export default function StudentSelection({ authenticatedUser, onStudentSelect, onLogout }: StudentSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = allStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300">
              <BookOpen className="h-8 w-8 text-white" />
              <h1 className="text-4xl font-bold text-white">Welcome, {authenticatedUser.name}!</h1>
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

        {/* User Info Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{authenticatedUser.name}</h2>
                <p className="text-gray-600 mb-2">{authenticatedUser.email}</p>
                <div className="flex gap-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">{authenticatedUser.rollNo}</Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">{authenticatedUser.class}</Badge>
                  <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500">{authenticatedUser.year}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Total Students</p>
                  <p className="text-2xl font-bold">{allStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Present Today</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Attendance Rate</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Days Active</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Selection */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Select Student Profile
            </CardTitle>
            <CardDescription className="text-lg">Choose a student profile to mark attendance for</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="mb-6">
              <Label htmlFor="search" className="text-lg font-semibold mb-2 block">
                Search Student
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, roll number, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg p-4 border-2 focus:border-purple-500 hover:border-purple-300 transition-colors"
                />
              </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className={`cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-purple-300 ${
                    student.id === authenticatedUser.id
                      ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400"
                      : "bg-gradient-to-br from-white to-gray-50"
                  }`}
                  onClick={() => onStudentSelect(student)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {student.name}
                          {student.id === authenticatedUser.id && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">You</Badge>
                          )}
                        </h3>
                        <p className="text-gray-600">{student.rollNo}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all">
                        {student.class}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all ml-2">
                        {student.year}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No students found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-white/80">© 2024 Student Attendance System. Authenticated Session Active.</p>
        </div>
      </div>
    </div>
  )
}
