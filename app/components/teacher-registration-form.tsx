"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  UserPlus,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Hash,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Lock,
  Building,
  Award,
} from "lucide-react"
import { teacherDatabase, type TeacherRegistrationData, type Teacher } from "../../lib/teacher-database"

interface TeacherRegistrationFormProps {
  onRegister: (teacher: Teacher) => void
  onBackToLogin: () => void
}

export default function TeacherRegistrationForm({ onRegister, onBackToLogin }: TeacherRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    subjects: [] as string[],
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    experience: "",
    joiningDate: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Available subjects for selection
  const availableSubjects = [
    "Data Structures",
    "Algorithms",
    "Database Management",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Machine Learning",
    "Artificial Intelligence",
    "Digital Electronics",
    "Microprocessors",
    "Circuit Design",
    "Thermodynamics",
    "Fluid Mechanics",
    "Machine Design",
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
    "Communication Skills",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (
      !formData.name ||
      !formData.employeeId ||
      !formData.email ||
      !formData.department ||
      formData.subjects.length === 0
    ) {
      setError("Please fill in all required fields and select at least one subject")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const registrationData: TeacherRegistrationData = {
        name: formData.name,
        employeeId: formData.employeeId.toUpperCase(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        department: formData.department,
        subjects: formData.subjects,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        qualification: formData.qualification || undefined,
        experience: formData.experience || undefined,
        joiningDate: formData.joiningDate || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyPhone: formData.emergencyPhone || undefined,
      }

      const newTeacher = await teacherDatabase.registerTeacher(registrationData)

      setSuccess(
        `Registration successful! Welcome ${newTeacher.name} (${newTeacher.employeeId}). Redirecting to dashboard...`,
      )
      console.log(`✅ Teacher registration completed:`)
      console.log(`- Name: ${newTeacher.name}`)
      console.log(`- Employee ID: ${newTeacher.employeeId}`)
      console.log(`- Department: ${newTeacher.department}`)
      console.log(`- Subjects: ${newTeacher.subjects.join(", ")}`)
      console.log(`- Email: ${newTeacher.email}`)

      setTimeout(() => {
        onRegister(newTeacher)
      }, 1500)
    } catch (err) {
      console.error("Teacher registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    }

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    if (error) setError("")
  }

  const handleSubjectToggle = (subject: string) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter((s) => s !== subject)
      : [...formData.subjects, subject]

    setFormData({
      ...formData,
      subjects: updatedSubjects,
    })
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <GraduationCap className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Teacher Registration</h1>
          </div>
          <p className="text-white/90 text-lg">Join our faculty and help shape the future</p>
        </div>

        {/* Registration Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Create Teacher Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill in your details to register as a new faculty member
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>

                {/* Name and Employee ID Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-sm font-semibold text-gray-700">
                      Employee ID *
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        placeholder="e.g., T006"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors uppercase"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth and Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">
                      Date of Birth
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                      Gender
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger className="h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pl-10 min-h-[80px] border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Academic Information
                </h3>

                {/* Department and Qualification Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-semibold text-gray-700">
                      Department *
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("department", value)} required>
                      <SelectTrigger className="h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Select your department" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Chemical">Chemical</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-sm font-semibold text-gray-700">
                      Highest Qualification
                    </Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="qualification"
                        name="qualification"
                        type="text"
                        placeholder="e.g., Ph.D. in Computer Science"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience and Joining Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                      Years of Experience
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="experience"
                        name="experience"
                        type="text"
                        placeholder="e.g., 5 years"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joiningDate" className="text-sm font-semibold text-gray-700">
                      Joining Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="joiningDate"
                        name="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Subjects Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Subjects You Can Teach * (Select at least one)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border-2 border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {availableSubjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject}
                          checked={formData.subjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                          className="border-emerald-500 data-[state=checked]:bg-emerald-500"
                        />
                        <Label htmlFor={subject} className="text-sm text-gray-700 cursor-pointer">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">Selected: {formData.subjects.length} subjects</p>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="text-sm font-semibold text-gray-700">
                      Emergency Contact Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        type="text"
                        placeholder="Enter emergency contact name"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone" className="text-sm font-semibold text-gray-700">
                      Emergency Contact Phone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        type="tel"
                        placeholder="Enter emergency contact phone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </h3>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading || success !== ""}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Registration Successful!
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Teacher Account
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Button
                onClick={onBackToLogin}
                variant="ghost"
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Already have an account? Sign In
              </Button>
            </div>

            {/* Registration Requirements */}
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Registration Requirements
              </h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Fields marked with * are required</li>
                <li>• Password must be at least 6 characters long</li>
                <li>• Employee ID and email must be unique</li>
                <li>• Select at least one subject you can teach</li>
                <li>• All data is stored securely in the database</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">© 2024 Student Attendance System. Join our teaching community!</p>
        </div>
      </div>
    </div>
  )
}
