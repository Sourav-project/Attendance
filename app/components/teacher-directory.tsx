"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, GraduationCap, RefreshCw, Filter, BarChart3, Building, BookOpen } from "lucide-react"
import { teacherDatabase, type Teacher, type TeacherStats } from "../../lib/teacher-database"
import TeacherProfileCard from "./teacher-profile-card"

interface TeacherDirectoryProps {
  showActions?: boolean
  onTeacherSelect?: (teacher: Teacher) => void
}

export default function TeacherDirectory({ showActions = false, onTeacherSelect }: TeacherDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")

  // Load teachers and stats
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [teachersData, statsData] = await Promise.all([
          teacherDatabase.getAllTeachers(),
          teacherDatabase.getTeacherStats(),
        ])
        setTeachers(teachersData)
        setStats(statsData)
        console.log(`📚 Teacher Directory loaded: ${teachersData.length} teachers`)
      } catch (error) {
        console.error("Failed to load teacher data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter and sort teachers
  useEffect(() => {
    const filtered = teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (teacher.qualification && teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDepartment = filterDepartment === "all" || teacher.department === filterDepartment

      return matchesSearch && matchesDepartment
    })

    // Sort teachers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "employeeId":
          return a.employeeId.localeCompare(b.employeeId)
        case "department":
          return a.department.localeCompare(b.department)
        case "experience":
          const aExp = Number.parseInt(a.experience?.replace(/\D/g, "") || "0")
          const bExp = Number.parseInt(b.experience?.replace(/\D/g, "") || "0")
          return bExp - aExp
        case "subjects":
          return b.subjects.length - a.subjects.length
        default:
          return 0
      }
    })

    setFilteredTeachers(filtered)
  }, [teachers, searchTerm, filterDepartment, sortBy])

  const refreshData = async () => {
    setLoading(true)
    try {
      const [teachersData, statsData] = await Promise.all([
        teacherDatabase.getAllTeachers(),
        teacherDatabase.getTeacherStats(),
      ])
      setTeachers(teachersData)
      setStats(statsData)
      console.log(`🔄 Teacher Directory refreshed: ${teachersData.length} teachers`)
    } catch (error) {
      console.error("Failed to refresh teacher data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique departments for filter
  const departments = [...new Set(teachers.map((t) => t.department))].sort()

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-emerald-600" />
                Teacher Directory
              </CardTitle>
              <CardDescription>
                Comprehensive faculty database with {teachers.length} registered teachers
              </CardDescription>
            </div>
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        {/* Quick Stats */}
        {stats && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <GraduationCap className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-600">{stats.activeTeachers}</p>
                <p className="text-xs text-gray-600">Active Teachers</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <Building className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600">{Object.keys(stats.departmentCount).length}</p>
                <p className="text-xs text-gray-600">Departments</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-600">{Object.keys(stats.subjectCount).length}</p>
                <p className="text-xs text-gray-600">Subjects</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-orange-600">{stats.averageExperience}</p>
                <p className="text-xs text-gray-600">Avg. Experience</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search and Filters */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-600" />
            Search & Filter Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
              />
            </div>

            {/* Department Filter */}
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="h-12 border-2 focus:border-emerald-500 hover:border-emerald-300">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept} ({stats?.departmentCount[dept] || 0})
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
                <SelectItem value="employeeId">Sort by Employee ID</SelectItem>
                <SelectItem value="department">Sort by Department</SelectItem>
                <SelectItem value="experience">Sort by Experience</SelectItem>
                <SelectItem value="subjects">Sort by Subject Count</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-center h-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200">
              <span className="text-emerald-700 font-semibold">
                {filteredTeachers.length} of {teachers.length} teachers
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
          <span className="text-emerald-600">Loading teachers...</span>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500">
            {searchTerm || filterDepartment !== "all"
              ? "No teachers found matching your criteria."
              : "No teachers registered yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherProfileCard
              key={teacher.id}
              teacher={teacher}
              showActions={showActions}
              onViewDetails={() => onTeacherSelect?.(teacher)}
              onEdit={() => console.log(`Edit teacher: ${teacher.name}`)}
            />
          ))}
        </div>
      )}

      {/* Department Summary */}
      {stats && Object.keys(stats.departmentCount).length > 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(stats.departmentCount).map(([dept, count]) => (
                <div key={dept} className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <p className="font-semibold text-blue-800 truncate">{dept}</p>
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-xs text-blue-600">
                    {Math.round((count / stats.activeTeachers) * 100)}% of faculty
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
