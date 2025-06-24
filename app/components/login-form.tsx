"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, BookOpen, LogIn, AlertCircle, User, UserPlus, ArrowLeft } from "lucide-react"
import type { User as UserType } from "../page"
import { studentDatabase, type LoginCredentials } from "../../lib/database-client"

interface LoginFormProps {
  onLogin: (user: UserType) => void
  onGoToRegister: () => void
  onBackToPortal: () => void
}

export default function LoginForm({ onLogin, onGoToRegister, onBackToPortal }: LoginFormProps) {
  const [formData, setFormData] = useState({
    identifier: "", // Can be roll number or email
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
      const credentials: LoginCredentials = {
        identifier: formData.identifier,
        password: formData.password,
      }

      const student = await studentDatabase.authenticateStudent(credentials)

      if (student) {
        console.log(`Login successful for: ${student.name} (${student.rollNo})`)
        const userForApp: UserType = {
          id: student.id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          class: student.class,
          year: student.year,
        }
        onLogin(userForApp)
      } else {
        setError("Invalid credentials. Please check your roll number/email and password.")
      }
    } catch (err) {
      console.error("Login error:", err)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Student Portal</h1>
          </div>
          <p className="text-white/90 text-lg">Sign in to mark your attendance</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Student Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access the attendance system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-semibold text-gray-700">
                  Roll Number or Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="Enter roll number or email"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-2 focus:border-purple-500 hover:border-purple-300 transition-colors"
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
                    className="pl-10 pr-10 h-12 border-2 focus:border-purple-500 hover:border-purple-300 transition-colors"
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
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Demo Credentials
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Roll No:</strong> CS001 | <strong>Password:</strong> alice123
                </p>
                <p>
                  <strong>Email:</strong> bob.smith@university.edu | <strong>Password:</strong> bob123
                </p>
                <p className="text-xs text-blue-600 mt-2">Try any student from CS001-CS005 with password: [name]123</p>
              </div>
            </div>

            {/* Create Account Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">Don't have an account?</p>
              <Button
                onClick={onGoToRegister}
                variant="outline"
                className="w-full h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 mb-3"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create New Account
              </Button>

              {/* Back to Portal */}
              <Button
                onClick={onBackToPortal}
                variant="ghost"
                className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal Selection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">© 2024 Student Attendance System. Secure & Reliable.</p>
        </div>
      </div>
    </div>
  )
}
