"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, Award, Users, Edit, Eye } from "lucide-react"
import type { Teacher } from "../../lib/teacher-database"
import { formatTeacherExperience, getTeacherDisplayName, calculateTeacherAge } from "../../lib/teacher-database"

interface TeacherProfileCardProps {
  teacher: Teacher
  showActions?: boolean
  onEdit?: () => void
  onViewDetails?: () => void
}

export default function TeacherProfileCard({
  teacher,
  showActions = false,
  onEdit,
  onViewDetails,
}: TeacherProfileCardProps) {
  const teacherAge = calculateTeacherAge(teacher.dateOfBirth)
  const displayName = getTeacherDisplayName(teacher)

  return (
    <Card className="hover:scale-102 transition-all duration-300 hover:shadow-lg border-2 hover:border-emerald-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{displayName}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-xs">{teacher.employeeId}</Badge>
              </CardDescription>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onViewDetails}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="truncate">{teacher.email}</span>
          </div>

          {teacher.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{teacher.phone}</span>
            </div>
          )}

          {teacher.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{teacher.address}</span>
            </div>
          )}

          {teacher.dateOfBirth && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(teacher.dateOfBirth).toLocaleDateString()}
                {teacherAge && ` (${teacherAge} years old)`}
              </span>
            </div>
          )}
        </div>

        {/* Academic Information */}
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs">{teacher.department}</Badge>
            {teacher.gender && (
              <Badge variant="outline" className="text-xs">
                {teacher.gender}
              </Badge>
            )}
          </div>

          {teacher.qualification && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-gray-700">{teacher.qualification}</span>
            </div>
          )}

          {teacher.experience && (
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">{formatTeacherExperience(teacher.experience)}</span>
            </div>
          )}

          {teacher.joiningDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Joined: {new Date(teacher.joiningDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Subjects */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Teaching Subjects ({teacher.subjects.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {teacher.subjects.slice(0, 3).map((subject, index) => (
              <Badge key={index} variant="outline" className="text-xs border-purple-300 text-purple-700">
                {subject}
              </Badge>
            ))}
            {teacher.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{teacher.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        {teacher.emergencyContact && (
          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-3 w-3" />
              <strong>Emergency Contact:</strong>
            </div>
            <div>{teacher.emergencyContact}</div>
            {teacher.emergencyPhone && <div>{teacher.emergencyPhone}</div>}
          </div>
        )}

        {/* Registration Date */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Registered: {new Date(teacher.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
