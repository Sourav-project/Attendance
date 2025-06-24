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
import {
  Eye,
  EyeOff,
  UserPlus,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  GraduationCap,
  Hash,
  Phone,
  MapPin,
  Calendar,
  Users,
  Lock,
} from "lucide-react"
import type { User as UserType } from "../page"
import { studentDatabase, type RegistrationData } from "../../lib/database-client"

interface RegistrationFormProps {
  onRegister: (user: UserType) => void
  onBackToLogin: () => void
}

export default function RegistrationForm({ onRegister, onBackToLogin }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: "",
    year: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    guardianName: "",
    guardianPhone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation (keep existing validation code)
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

    if (!formData.name || !formData.rollNo || !formData.email || !formData.class || !formData.year) {
      setError("Please fill in all required fields")
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
      const registrationData: RegistrationData = {
        name: formData.name,
        rollNo: formData.rollNo.toUpperCase(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        class: formData.class,
        year: formData.year,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        guardianName: formData.guardianName || undefined,
        guardianPhone: formData.guardianPhone || undefined,
      }

      const newStudent = await studentDatabase.registerStudent(registrationData)

      setSuccess("Registration successful! Redirecting to dashboard...")
      console.log(`Registration successful for: ${newStudent.name} (${newStudent.rollNo})`)

      const userForApp: UserType = {
        id: newStudent.id,
        name: newStudent.name,
        rollNo: newStudent.rollNo,
        email: newStudent.email,
        class: newStudent.class,
        year: newStudent.year,
      }

      setTimeout(() => {
        onRegister(userForApp)
      }, 1500)
    } catch (err) {
      console.error("Registration error:", err)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Student Registration</h1>
          </div>
          <p className="text-white/90 text-lg">Create your account to access the attendance system</p>
        </div>

        {/* Registration Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill in your details to register as a new student
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>

                {/* Name and Roll Number Row */}
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
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNo" className="text-sm font-semibold text-gray-700">
                      Roll Number *
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="rollNo"
                        name="rollNo"
                        type="text"
                        placeholder="e.g., CS001"
                        value={formData.rollNo}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors uppercase"
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
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
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
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
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
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                      Gender
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger className="h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors">
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
                      className="pl-10 min-h-[80px] border-2 focus:border-blue-500 hover:border-blue-300 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </h3>

                {/* Class and Year Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-sm font-semibold text-gray-700">
                      Class/Department *
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("class", value)} required>
                      <SelectTrigger className="h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Select your class" />
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-semibold text-gray-700">
                      Academic Year *
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("year", value)} required>
                      <SelectTrigger className="h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Guardian Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Guardian Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName" className="text-sm font-semibold text-gray-700">
                      Guardian Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="guardianName"
                        name="guardianName"
                        type="text"
                        placeholder="Enter guardian's name"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone" className="text-sm font-semibold text-gray-700">
                      Guardian Phone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="guardianPhone"
                        name="guardianPhone"
                        type="tel"
                        placeholder="Enter guardian's phone"
                        value={formData.guardianPhone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
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
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pr-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
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
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pr-10 h-12 border-2 focus:border-blue-500 hover:border-blue-300 transition-colors"
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
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Button
                onClick={onBackToLogin}
                variant="ghost"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Already have an account? Sign In
              </Button>
            </div>

            {/* Password Requirements */}
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Registration Information
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fields marked with * are required</li>
                <li>• Password must be at least 6 characters long</li>
                <li>• Roll number and email must be unique</li>
                <li>• All data is stored securely in the database</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">© 2024 Student Attendance System. Join our community today!</p>
        </div>
      </div>
    </div>
  )
}
