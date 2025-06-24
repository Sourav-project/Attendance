"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react"
import { studentDatabase, type Student } from "../../lib/database-client"

interface StudentSearchProps {
  onStudentSelect?: (student: Student) => void
  showActions?: boolean
}

export default function StudentSearch({ onStudentSelect, showActions = false }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [allStudents, setAllStudents] = useState<Student[]>([])

  // Load all students on component mount
  useEffect(() => {
    const loadAllStudents = async () => {
      try {
        const students = await studentDatabase.getAllStudents()
        setAllStudents(students)
        setSearchResults(students.slice(0, 10)) // Show first 10 initially
      } catch (error) {
        console.error("Failed to load students:", error)
      }
    }

    loadAllStudents()
  }, [])

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults(allStudents.slice(0, 10))
        return
      }

      setLoading(true)
      try {
        const results = await studentDatabase.searchStudents(searchTerm)
        setSearchResults(results)
      } catch (error) {
        console.error("Search failed:", error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, allStudents])

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6 text-blue-600" />
          Student Directory
        </CardTitle>
        <CardDescription>Search and browse registered students ({allStudents.length} total)</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name, roll number, email, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "No students found matching your search." : "No students available."}
              </p>
            </div>
          ) : (
            searchResults.map((student) => (
              <Card
                key={student.id}
                className="hover:scale-102 transition-all duration-300 hover:shadow-lg border-2 hover:border-blue-300 cursor-pointer"
                onClick={() => onStudentSelect?.(student)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                      <User className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{student.name}</h3>
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs">{student.rollNo}</Badge>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{student.email}</span>
                        </div>

                        {student.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{student.phone}</span>
                          </div>
                        )}

                        {student.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{student.address}</span>
                          </div>
                        )}

                        {student.dateOfBirth && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">
                          {student.class}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-xs">{student.year}</Badge>
                        {student.gender && (
                          <Badge variant="outline" className="text-xs">
                            {student.gender}
                          </Badge>
                        )}
                      </div>

                      {student.guardianName && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <strong>Guardian:</strong> {student.guardianName}
                          {student.guardianPhone && ` (${student.guardianPhone})`}
                        </div>
                      )}
                    </div>

                    {showActions && (
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onStudentSelect?.(student)
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          Select
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Results Summary */}
        {searchResults.length > 0 && (
          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            Showing {searchResults.length} of {allStudents.length} students
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
