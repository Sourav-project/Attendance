"\"use client"

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

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegistrationData {
  name: string
  rollNo: string
  email: string
  password: string
  class: string
  year: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  guardianName?: string
  guardianPhone?: string
}

// Enhanced database with proper student recognition
class StudentDatabase {
  private students: any[] = []
  private attendanceRecords: any[] = []
  private initialized = false

  constructor() {
    this.initializeDatabase()
  }

  private async initializeDatabase() {
    if (this.initialized) return

    // Load initial student data with proper authentication
    this.students = [
      {
        id: 1,
        name: "Alice Johnson",
        rollNo: "CS001",
        email: "alice.johnson@university.edu",
        passwordHash: "alice123", // In production, use proper hashing
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
        passwordHash: "bob123",
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
        passwordHash: "carol123",
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
        passwordHash: "david123",
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
        passwordHash: "emma123",
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
      {
        id: 6,
        name: "Frank Miller",
        rollNo: "CS006",
        email: "frank.miller@university.edu",
        passwordHash: "frank123",
        class: "Computer Science",
        year: "2nd Year",
        phone: "+1234567800",
        address: "987 Cedar St, City",
        dateOfBirth: "2003-04-18",
        gender: "Male",
        guardianName: "Lisa Miller",
        guardianPhone: "+1234567801",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 7,
        name: "Grace Lee",
        rollNo: "CS007",
        email: "grace.lee@university.edu",
        passwordHash: "grace123",
        class: "Computer Science",
        year: "2nd Year",
        phone: "+1234567802",
        address: "147 Birch Ave, City",
        dateOfBirth: "2003-06-25",
        gender: "Female",
        guardianName: "James Lee",
        guardianPhone: "+1234567803",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 8,
        name: "Henry Taylor",
        rollNo: "CS008",
        email: "henry.taylor@university.edu",
        passwordHash: "henry123",
        class: "Computer Science",
        year: "1st Year",
        phone: "+1234567804",
        address: "258 Spruce St, City",
        dateOfBirth: "2004-02-14",
        gender: "Male",
        guardianName: "Anna Taylor",
        guardianPhone: "+1234567805",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 9,
        name: "Ivy Chen",
        rollNo: "IT001",
        email: "ivy.chen@university.edu",
        passwordHash: "ivy123",
        class: "Information Technology",
        year: "2nd Year",
        phone: "+1234567806",
        address: "369 Willow Ave, City",
        dateOfBirth: "2003-08-07",
        gender: "Female",
        guardianName: "David Chen",
        guardianPhone: "+1234567807",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 10,
        name: "Jack Rodriguez",
        rollNo: "IT002",
        email: "jack.rodriguez@university.edu",
        passwordHash: "jack123",
        class: "Information Technology",
        year: "1st Year",
        phone: "+1234567808",
        address: "741 Poplar St, City",
        dateOfBirth: "2004-11-03",
        gender: "Male",
        guardianName: "Maria Rodriguez",
        guardianPhone: "+1234567809",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
    ]

    // Load attendance records
    this.attendanceRecords = [
      // Alice Johnson attendance
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
      {
        id: 3,
        studentId: 1,
        date: "2024-01-17",
        status: "absent",
        subject: "Computer Networks",
        location: "Room 103",
        createdAt: "2024-01-17T09:00:00Z",
      },
      {
        id: 4,
        studentId: 1,
        date: "2024-01-18",
        timeIn: "09:00:00",
        status: "present",
        subject: "Operating Systems",
        location: "Room 104",
        markedBy: 1,
        createdAt: "2024-01-18T09:00:00Z",
      },
      {
        id: 5,
        studentId: 1,
        date: "2024-01-19",
        timeIn: "09:00:00",
        status: "present",
        subject: "Software Engineering",
        location: "Room 105",
        markedBy: 1,
        createdAt: "2024-01-19T09:00:00Z",
      },
      // Bob Smith attendance
      {
        id: 6,
        studentId: 2,
        date: "2024-01-15",
        timeIn: "09:05:00",
        status: "present",
        subject: "Data Structures",
        location: "Room 101",
        markedBy: 2,
        createdAt: "2024-01-15T09:05:00Z",
      },
      {
        id: 7,
        studentId: 2,
        date: "2024-01-16",
        timeIn: "09:00:00",
        status: "present",
        subject: "Database Management",
        location: "Room 102",
        markedBy: 2,
        createdAt: "2024-01-16T09:00:00Z",
      },
      {
        id: 8,
        studentId: 2,
        date: "2024-01-17",
        timeIn: "09:00:00",
        status: "present",
        subject: "Computer Networks",
        location: "Room 103",
        markedBy: 2,
        createdAt: "2024-01-17T09:00:00Z",
      },
      {
        id: 9,
        studentId: 2,
        date: "2024-01-18",
        status: "absent",
        subject: "Operating Systems",
        location: "Room 104",
        createdAt: "2024-01-18T09:00:00Z",
      },
      {
        id: 10,
        studentId: 2,
        date: "2024-01-19",
        timeIn: "09:00:00",
        status: "present",
        subject: "Software Engineering",
        location: "Room 105",
        markedBy: 2,
        createdAt: "2024-01-19T09:00:00Z",
      },
      // Add more records for other students...
    ]

    this.initialized = true
    console.log(
      `Database initialized with ${this.students.length} students and ${this.attendanceRecords.length} attendance records`,
    )
  }

  // Student Recognition and Authentication
  async authenticateStudent(credentials: LoginCredentials): Promise<Student | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const student = this.students.find(
          (s) =>
            (s.rollNo.toLowerCase() === credentials.identifier.toLowerCase() ||
              s.email.toLowerCase() === credentials.identifier.toLowerCase()) &&
            s.passwordHash === credentials.password,
        )

        if (student) {
          console.log(`Student authenticated: ${student.name} (${student.rollNo})`)
          resolve({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
            class: student.class,
            year: student.year,
            phone: student.phone,
            address: student.address,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
            createdAt: student.createdAt,
            isActive: student.isActive,
          })
        } else {
          console.log(`Authentication failed for: ${credentials.identifier}`)
          resolve(null)
        }
      }, 500)
    })
  }

  // Student Registration
  async registerStudent(data: RegistrationData): Promise<Student> {
    await this.initializeDatabase()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for existing student
        const existingStudent = this.students.find(
          (s) =>
            s.rollNo.toLowerCase() === data.rollNo.toLowerCase() || s.email.toLowerCase() === data.email.toLowerCase(),
        )

        if (existingStudent) {
          console.log(`Registration failed: Student already exists with roll no ${data.rollNo} or email ${data.email}`)
          reject(new Error("Student with this roll number or email already exists"))
          return
        }

        const newStudent = {
          id: Math.max(...this.students.map((s) => s.id), 0) + 1,
          name: data.name,
          rollNo: data.rollNo.toUpperCase(),
          email: data.email.toLowerCase(),
          passwordHash: data.password, // In production, hash this
          class: data.class,
          year: data.year,
          phone: data.phone,
          address: data.address,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          guardianName: data.guardianName,
          guardianPhone: data.guardianPhone,
          createdAt: new Date().toISOString(),
          isActive: true,
        }

        this.students.push(newStudent)
        console.log(`New student registered: ${newStudent.name} (${newStudent.rollNo})`)
        resolve({
          id: newStudent.id,
          name: newStudent.name,
          rollNo: newStudent.rollNo,
          email: newStudent.email,
          class: newStudent.class,
          year: newStudent.year,
          phone: newStudent.phone,
          address: newStudent.address,
          dateOfBirth: newStudent.dateOfBirth,
          gender: newStudent.gender,
          guardianName: newStudent.guardianName,
          guardianPhone: newStudent.guardianPhone,
          createdAt: newStudent.createdAt,
          isActive: newStudent.isActive,
        })
      }, 200)
    })
  }

  // Get all students (for admin/viewing purposes)
  async getAllStudents(): Promise<Student[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.students
            .filter((s) => s.isActive)
            .map((student) => ({
              id: student.id,
              name: student.name,
              rollNo: student.rollNo,
              email: student.email,
              class: student.class,
              year: student.year,
              phone: student.phone,
              address: student.address,
              dateOfBirth: student.dateOfBirth,
              gender: student.gender,
              guardianName: student.guardianName,
              guardianPhone: student.guardianPhone,
              createdAt: student.createdAt,
              isActive: student.isActive,
            })),
        )
      }, 100)
    })
  }

  // Get student by ID
  async getStudentById(id: number): Promise<Student | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const student = this.students.find((s) => s.id === id && s.isActive)
        if (student) {
          resolve({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
            class: student.class,
            year: student.year,
            phone: student.phone,
            address: student.address,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
            createdAt: student.createdAt,
            isActive: student.isActive,
          })
        } else {
          resolve(null)
        }
      }, 100)
    })
  }

  // Get student by roll number
  async getStudentByRollNo(rollNo: string): Promise<Student | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const student = this.students.find((s) => s.rollNo.toLowerCase() === rollNo.toLowerCase() && s.isActive)
        if (student) {
          resolve({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
            class: student.class,
            year: student.year,
            phone: student.phone,
            address: student.address,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
            createdAt: student.createdAt,
            isActive: student.isActive,
          })
        } else {
          resolve(null)
        }
      }, 100)
    })
  }

  // Mark attendance for a student
  async markAttendance(
    studentId: number,
    date: string = new Date().toISOString().split("T")[0],
    subject?: string,
    location?: string,
  ): Promise<AttendanceRecord> {
    await this.initializeDatabase()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = this.students.find((s) => s.id === studentId)
        if (!student) {
          reject(new Error("Student not found"))
          return
        }

        // Check if attendance already marked for today and subject
        const existingRecord = this.attendanceRecords.find(
          (r) => r.studentId === studentId && r.date === date && r.subject === subject,
        )

        if (existingRecord) {
          // Update existing record
          existingRecord.timeIn = new Date().toTimeString().split(" ")[0]
          existingRecord.status = "present"
          existingRecord.markedBy = studentId
          resolve(existingRecord)
        } else {
          // Create new record
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
        }
      }, 200)
    })
  }

  // Get attendance records for a student
  async getStudentAttendance(studentId: number): Promise<AttendanceRecord[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.attendanceRecords
            .filter((r) => r.studentId === studentId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        )
      }, 100)
    })
  }

  // Get attendance statistics for a student
  async getStudentAttendanceStats(studentId: number): Promise<AttendanceStats | null> {
    await this.initializeDatabase()

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

  // Get attendance statistics for all students
  async getAllAttendanceStats(): Promise<AttendanceStats[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.students
            .filter((s) => s.isActive)
            .map((student) => {
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
            .sort((a, b) => a.rollNo.localeCompare(b.rollNo)),
        )
      }, 100)
    })
  }

  // Search students
  async searchStudents(query: string): Promise<Student[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase()
        const results = this.students
          .filter((s) => s.isActive)
          .filter(
            (student) =>
              student.name.toLowerCase().includes(searchTerm) ||
              student.rollNo.toLowerCase().includes(searchTerm) ||
              student.email.toLowerCase().includes(searchTerm) ||
              student.class.toLowerCase().includes(searchTerm),
          )
          .map((student) => ({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
            class: student.class,
            year: student.year,
            phone: student.phone,
            address: student.address,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
            createdAt: student.createdAt,
            isActive: student.isActive,
          }))

        resolve(results)
      }, 100)
    })
  }

  // Get students by class
  async getStudentsByClass(className: string, year?: string): Promise<Student[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const students = this.students
          .filter((s) => s.isActive)
          .filter((s) => {
            const classMatch = s.class.toLowerCase() === className.toLowerCase()
            const yearMatch = !year || s.year.toLowerCase() === year.toLowerCase()
            return classMatch && yearMatch
          })
          .map((student) => ({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
            class: student.class,
            year: student.year,
            phone: student.phone,
            address: student.address,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
            createdAt: student.createdAt,
            isActive: student.isActive,
          }))

        resolve(students)
      }, 100)
    })
  }

  // Update student information
  async updateStudent(id: number, updates: Partial<Student>): Promise<Student | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.students.findIndex((s) => s.id === id)
        if (index === -1) {
          resolve(null)
          return
        }

        this.students[index] = { ...this.students[index], ...updates }
        const student = this.students[index]
        resolve({
          id: student.id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          class: student.class,
          year: student.year,
          phone: student.phone,
          address: student.address,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          guardianName: student.guardianName,
          guardianPhone: student.guardianPhone,
          createdAt: student.createdAt,
          isActive: student.isActive,
        })
      }, 100)
    })
  }

  // Get database statistics
  async getDatabaseStats(): Promise<{
    totalStudents: number
    activeStudents: number
    totalAttendanceRecords: number
    averageAttendance: number
  }> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const totalStudents = this.students.length
        const activeStudents = this.students.filter((s) => s.isActive).length
        const totalAttendanceRecords = this.attendanceRecords.length

        const allStats = this.students
          .filter((s) => s.isActive)
          .map((student) => {
            const records = this.attendanceRecords.filter((r) => r.studentId === student.id)
            const presentDays = records.filter((r) => r.status === "present").length
            const totalDays = records.length
            return totalDays > 0 ? (presentDays / totalDays) * 100 : 0
          })

        const averageAttendance =
          allStats.length > 0 ? Math.round(allStats.reduce((sum, rate) => sum + rate, 0) / allStats.length) : 0

        const stats = {
          totalStudents,
          activeStudents,
          totalAttendanceRecords,
          averageAttendance,
        }

        resolve(stats)
      }, 100)
    })
  }
}

// Export singleton instance
export const studentDatabase = new StudentDatabase()

// Export utility functions
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(" ")[0]
}

export const calculateAttendancePercentage = (present: number, total: number): number => {
  return total > 0 ? Math.round((present / total) * 100) : 0
}
