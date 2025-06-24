"use client"

// Database interface for client-side operations
// In a real application, this would connect to your actual database

export interface Student {
  id: number
  name: string
  rollNo: string
  email: string
  class: string
  year: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  guardianName?: string
  guardianPhone?: string
  createdAt: string
  isActive: boolean
}

export interface AttendanceRecord {
  id: number
  studentId: number
  date: string
  timeIn?: string
  timeOut?: string
  status: "present" | "absent"
  subject?: string
  location?: string
  markedBy?: number
  createdAt: string
}

export interface AttendanceStats {
  studentId: number
  studentName: string
  rollNo: string
  class: string
  year: string
  totalDays: number
  presentDays: number
  absentDays: number
  attendancePercentage: number
}

// Mock database - In production, replace with actual database calls
class MockDatabase {
  private students: Student[] = [
    {
      id: 1,
      name: "Alice Johnson",
      rollNo: "CS001",
      email: "alice.johnson@university.edu",
      class: "Computer Science",
      year: "3rd Year",
      phone: "+1234567890",
      address: "123 Main St, City",
      dateOfBirth: "2002-05-15",
      gender: "Female",
      guardianName: "Robert Johnson",
      guardianPhone: "+1234567891",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
    },
    {
      id: 2,
      name: "Bob Smith",
      rollNo: "CS002",
      email: "bob.smith@university.edu",
      class: "Computer Science",
      year: "3rd Year",
      phone: "+1234567892",
      address: "456 Oak Ave, City",
      dateOfBirth: "2002-03-22",
      gender: "Male",
      guardianName: "Mary Smith",
      guardianPhone: "+1234567893",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
    },
    {
      id: 3,
      name: "Carol Davis",
      rollNo: "CS003",
      email: "carol.davis@university.edu",
      class: "Computer Science",
      year: "3rd Year",
      phone: "+1234567894",
      address: "789 Pine St, City",
      dateOfBirth: "2002-07-08",
      gender: "Female",
      guardianName: "John Davis",
      guardianPhone: "+1234567895",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
    },
    {
      id: 4,
      name: "David Wilson",
      rollNo: "CS004",
      email: "david.wilson@university.edu",
      class: "Computer Science",
      year: "3rd Year",
      phone: "+1234567896",
      address: "321 Elm St, City",
      dateOfBirth: "2002-01-30",
      gender: "Male",
      guardianName: "Sarah Wilson",
      guardianPhone: "+1234567897",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
    },
    {
      id: 5,
      name: "Emma Brown",
      rollNo: "CS005",
      email: "emma.brown@university.edu",
      class: "Computer Science",
      year: "3rd Year",
      phone: "+1234567898",
      address: "654 Maple Ave, City",
      dateOfBirth: "2002-09-12",
      gender: "Female",
      guardianName: "Michael Brown",
      guardianPhone: "+1234567899",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true,
    },
  ]

  private attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      studentId: 1,
      date: "2024-01-15",
      timeIn: "09:00:00",
      status: "present",
      subject: "Data Structures",
      location: "Room 101",
      markedBy: 1,
      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      id: 2,
      studentId: 1,
      date: "2024-01-16",
      timeIn: "09:00:00",
      status: "present",
      subject: "Database Management",
      location: "Room 102",
      markedBy: 1,
      createdAt: "2024-01-16T09:00:00Z",
    },
    // Add more records as needed
  ]

  // Student operations
  async getAllStudents(): Promise<Student[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.students]), 100)
    })
  }

  async getStudentByRollNo(rollNo: string): Promise<Student | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const student = this.students.find((s) => s.rollNo.toLowerCase() === rollNo.toLowerCase())
        resolve(student || null)
      }, 100)
    })
  }

  async getStudentByEmail(email: string): Promise<Student | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const student = this.students.find((s) => s.email.toLowerCase() === email.toLowerCase())
        resolve(student || null)
      }, 100)
    })
  }

  async createStudent(studentData: Omit<Student, "id" | "createdAt">): Promise<Student> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for duplicates
        const existingStudent = this.students.find(
          (s) => s.rollNo === studentData.rollNo || s.email === studentData.email,
        )
        if (existingStudent) {
          reject(new Error("Student with this roll number or email already exists"))
          return
        }

        const newStudent: Student = {
          ...studentData,
          id: Math.max(...this.students.map((s) => s.id), 0) + 1,
          createdAt: new Date().toISOString(),
        }
        this.students.push(newStudent)
        resolve(newStudent)
      }, 200)
    })
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<Student | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.students.findIndex((s) => s.id === id)
        if (index === -1) {
          resolve(null)
          return
        }
        this.students[index] = { ...this.students[index], ...updates }
        resolve(this.students[index])
      }, 100)
    })
  }

  // Attendance operations
  async markAttendance(
    studentId: number,
    date: string,
    subject?: string,
    location?: string,
  ): Promise<AttendanceRecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord: AttendanceRecord = {
          id: Math.max(...this.attendanceRecords.map((r) => r.id), 0) + 1,
          studentId,
          date,
          timeIn: new Date().toTimeString().split(" ")[0],
          status: "present",
          subject: subject || "General",
          location: location || "Room 101",
          markedBy: studentId,
          createdAt: new Date().toISOString(),
        }
        this.attendanceRecords.push(newRecord)
        resolve(newRecord)
      }, 200)
    })
  }

  async getStudentAttendance(studentId: number): Promise<AttendanceRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = this.attendanceRecords.filter((r) => r.studentId === studentId)
        resolve(records)
      }, 100)
    })
  }

  async getAttendanceStats(studentId: number): Promise<AttendanceStats | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const student = this.students.find((s) => s.id === studentId)
        if (!student) {
          resolve(null)
          return
        }

        const records = this.attendanceRecords.filter((r) => r.studentId === studentId)
        const presentDays = records.filter((r) => r.status === "present").length
        const totalDays = records.length
        const absentDays = totalDays - presentDays
        const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

        resolve({
          studentId,
          studentName: student.name,
          rollNo: student.rollNo,
          class: student.class,
          year: student.year,
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage,
        })
      }, 100)
    })
  }

  async getAllAttendanceStats(): Promise<AttendanceStats[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = this.students.map((student) => {
          const records = this.attendanceRecords.filter((r) => r.studentId === student.id)
          const presentDays = records.filter((r) => r.status === "present").length
          const totalDays = records.length
          const absentDays = totalDays - presentDays
          const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

          return {
            studentId: student.id,
            studentName: student.name,
            rollNo: student.rollNo,
            class: student.class,
            year: student.year,
            totalDays,
            presentDays,
            absentDays,
            attendancePercentage,
          }
        })
        resolve(stats)
      }, 100)
    })
  }

  // Authentication
  async authenticateStudent(identifier: string, password: string): Promise<Student | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock authentication - in production, verify hashed password
        const student = this.students.find(
          (s) =>
            (s.rollNo.toLowerCase() === identifier.toLowerCase() ||
              s.email.toLowerCase() === identifier.toLowerCase()) &&
            s.isActive,
        )
        // For demo purposes, accept any password that follows the pattern [name]123
        if (student) {
          const expectedPassword = student.name.split(" ")[0].toLowerCase() + "123"
          if (password === expectedPassword) {
            resolve(student)
            return
          }
        }
        resolve(null)
      }, 500)
    })
  }
}

// Export singleton instance
export const database = new MockDatabase()

// Utility functions
export const hashPassword = async (password: string): Promise<string> => {
  // Mock password hashing - use bcrypt in production
  return `$2b$10$${password}hashed`
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  // Mock password verification - use bcrypt in production
  return hash.includes(password)
}
