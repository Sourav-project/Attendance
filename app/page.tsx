"use client"

import { useState } from "react"
import LoginForm from "./components/login-form"
import AttendanceDashboard from "./components/attendance-dashboard"
import MarkAttendance from "./components/mark-attendance"
import RegistrationForm from "./components/registration-form"
import ViewOthersAttendance from "./components/view-others-attendance"
import TeacherLoginForm from "./components/teacher-login-form"
import TeacherDashboard from "./components/teacher-dashboard"
import PortalSelection from "./components/portal-selection"
import type { Teacher } from "../lib/teacher-database"
import TeacherRegistrationForm from "./components/teacher-registration-form"

export type User = {
  id: number
  name: string
  rollNo: string
  class: string
  year: string
  email: string
}

type ViewType =
  | "portal-selection"
  | "student-login"
  | "student-register"
  | "student-attendance"
  | "student-dashboard"
  | "student-view-others"
  | "teacher-login"
  | "teacher-register"
  | "teacher-dashboard"

export default function Component() {
  const [currentView, setCurrentView] = useState<ViewType>("portal-selection")
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null)
  const [authenticatedTeacher, setAuthenticatedTeacher] = useState<Teacher | null>(null)

  // Student handlers
  const handleStudentLogin = (user: User) => {
    setAuthenticatedUser(user)
    setCurrentView("student-attendance")
  }

  const handleStudentRegister = (user: User) => {
    setAuthenticatedUser(user)
    setCurrentView("student-attendance")
  }

  const handleStudentLogout = () => {
    setAuthenticatedUser(null)
    setCurrentView("portal-selection")
  }

  // Teacher handlers
  const handleTeacherLogin = (teacher: Teacher) => {
    setAuthenticatedTeacher(teacher)
    setCurrentView("teacher-dashboard")
  }

  const handleTeacherLogout = () => {
    setAuthenticatedTeacher(null)
    setCurrentView("portal-selection")
  }

  const handleTeacherRegister = (teacher: Teacher) => {
    setAuthenticatedTeacher(teacher)
    setCurrentView("teacher-dashboard")
  }

  // Portal selection
  if (currentView === "portal-selection") {
    return (
      <PortalSelection
        onSelectStudent={() => setCurrentView("student-login")}
        onSelectTeacher={() => setCurrentView("teacher-login")}
      />
    )
  }

  // Student flows
  if (currentView === "student-register") {
    return <RegistrationForm onRegister={handleStudentRegister} onBackToLogin={() => setCurrentView("student-login")} />
  }

  if (currentView === "student-login") {
    return (
      <LoginForm
        onLogin={handleStudentLogin}
        onGoToRegister={() => setCurrentView("student-register")}
        onBackToPortal={() => setCurrentView("portal-selection")}
      />
    )
  }

  if (currentView === "student-attendance" && authenticatedUser) {
    return (
      <MarkAttendance
        student={authenticatedUser}
        onViewDashboard={() => setCurrentView("student-dashboard")}
        onViewOthers={() => setCurrentView("student-view-others")}
        onLogout={handleStudentLogout}
      />
    )
  }

  if (currentView === "student-dashboard" && authenticatedUser) {
    return (
      <AttendanceDashboard
        student={authenticatedUser}
        onBack={() => setCurrentView("student-attendance")}
        onViewOthers={() => setCurrentView("student-view-others")}
        onLogout={handleStudentLogout}
      />
    )
  }

  if (currentView === "student-view-others" && authenticatedUser) {
    return (
      <ViewOthersAttendance
        currentUser={authenticatedUser}
        onBack={() => setCurrentView("student-attendance")}
        onLogout={handleStudentLogout}
      />
    )
  }

  // Teacher flows
  if (currentView === "teacher-login") {
    return (
      <TeacherLoginForm
        onLogin={handleTeacherLogin}
        onBackToMain={() => setCurrentView("portal-selection")}
        onGoToRegister={() => setCurrentView("teacher-register")}
      />
    )
  }

  if (currentView === "teacher-register") {
    return (
      <TeacherRegistrationForm
        onRegister={handleTeacherRegister}
        onBackToLogin={() => setCurrentView("teacher-login")}
      />
    )
  }

  if (currentView === "teacher-dashboard" && authenticatedTeacher) {
    return <TeacherDashboard teacher={authenticatedTeacher} onLogout={handleTeacherLogout} />
  }

  return null
}
