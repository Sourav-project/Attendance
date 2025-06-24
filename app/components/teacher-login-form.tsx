"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, GraduationCap, LogIn, AlertCircle, User, ArrowLeft, UserPlus } from "lucide-react"
import { teacherDatabase, type TeacherLoginCredentials, type Teacher } from "../../lib/teacher-database"

interface TeacherLoginFormProps {
  onLogin: (teacher: Teacher) => void
  onBackToMain: () => void
  onGoToRegister?: () => void
}

export default function TeacherLoginForm({ onLogin, onBackToMain, onGoToRegister }: TeacherLoginFormProps) {
  const [formData, setFormData] = useState({
    identifier: "", // Can be employee ID or email
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const credentials: TeacherLoginCredentials = {
        identifier: formData.identifier,
        password: formData.password,
      }

      const teacher = await teacherDatabase.authenticateTeacher(credentials)

      if (teacher) {
        console.log(`Teacher login successful for: ${teacher.name} (${teacher.employeeId})`)
        onLogin(teacher)
      } else {
        setError("Invalid credentials. Please check your employee ID/email and password.")
      }
    } catch (err) {
      console.error("Teacher login error:", err)
      setError("Login failed. Please try again.")
    }

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <GraduationCap className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Teacher Portal</h1>
          </div>
          <p className="text-white/90 text-lg">Sign in to manage student attendance</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Teacher Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access the teacher dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-semibold text-gray-700">
                  Employee ID or Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="Enter employee ID or email"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-2 focus:border-emerald-500 hover:border-emerald-300 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.identifier || !formData.password}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Demo Teacher Credentials
              </h4>
              <div className="text-sm text-emerald-700 space-y-1">
                <p>
                  <strong>Employee ID:</strong> T001 | <strong>Password:</strong> teacher123
                </p>
                <p>
                  <strong>Email:</strong> sarah.johnson@university.edu | <strong>Password:</strong> teacher123
                </p>
                <p className="text-xs text-emerald-600 mt-2">
                  Try any teacher from T001-T005 with password: teacher123
                </p>
              </div>
            </div>

            {/* Create Account Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">Don't have an account?</p>
              <Button
                onClick={() => onGoToRegister?.()}
                variant="outline"
                className="w-full h-12 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create Teacher Account
              </Button>
            </div>

            {/* Back to Main */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Button
                onClick={onBackToMain}
                variant="ghost"
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">© 2024 Student Attendance System. Teacher Access Portal.</p>
        </div>
      </div>
    </div>
  )
}
