"use client"

export interface Teacher {
  id: number
  name: string
  employeeId: string
  email: string
  department: string
  subjects: string[]
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  qualification?: string
  experience?: string
  joiningDate?: string
  emergencyContact?: string
  emergencyPhone?: string
  createdAt: string
  isActive: boolean
}

export interface TeacherLoginCredentials {
  identifier: string
  password: string
}

export interface TeacherRegistrationData {
  name: string
  employeeId: string
  email: string
  password: string
  department: string
  subjects: string[]
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  qualification?: string
  experience?: string
  joiningDate?: string
  emergencyContact?: string
  emergencyPhone?: string
}

export interface TeacherStats {
  totalTeachers: number
  activeTeachers: number
  departmentCount: { [key: string]: number }
  subjectCount: { [key: string]: number }
  averageExperience: number
}

// Enhanced database with comprehensive teacher management
class TeacherDatabase {
  private teachers: any[] = []
  private initialized = false

  constructor() {
    this.initializeDatabase()
  }

  private async initializeDatabase() {
    if (this.initialized) return

    // Load initial teacher data with comprehensive information
    this.teachers = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        employeeId: "T001",
        email: "sarah.johnson@university.edu",
        passwordHash: "teacher123", // In production, use proper hashing
        department: "Computer Science",
        subjects: ["Data Structures", "Algorithms", "Database Management"],
        phone: "+1234567900",
        address: "123 Faculty Lane, University City",
        dateOfBirth: "1985-03-15",
        gender: "Female",
        qualification: "Ph.D. in Computer Science",
        experience: "8 years",
        joiningDate: "2020-08-15",
        emergencyContact: "John Johnson",
        emergencyPhone: "+1234567999",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 2,
        name: "Prof. Michael Chen",
        employeeId: "T002",
        email: "michael.chen@university.edu",
        passwordHash: "teacher123",
        department: "Computer Science",
        subjects: ["Operating Systems", "Computer Networks", "Software Engineering"],
        phone: "+1234567901",
        address: "456 Academic Ave, University City",
        dateOfBirth: "1980-07-22",
        gender: "Male",
        qualification: "Ph.D. in Software Engineering",
        experience: "12 years",
        joiningDate: "2018-01-10",
        emergencyContact: "Lisa Chen",
        emergencyPhone: "+1234567998",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        employeeId: "T003",
        email: "emily.rodriguez@university.edu",
        passwordHash: "teacher123",
        department: "Information Technology",
        subjects: ["Web Development", "Mobile App Development", "UI/UX Design"],
        phone: "+1234567902",
        address: "789 Education Blvd, University City",
        dateOfBirth: "1988-11-08",
        gender: "Female",
        qualification: "Ph.D. in Information Technology",
        experience: "6 years",
        joiningDate: "2021-09-01",
        emergencyContact: "Carlos Rodriguez",
        emergencyPhone: "+1234567997",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 4,
        name: "Prof. David Wilson",
        employeeId: "T004",
        email: "david.wilson@university.edu",
        passwordHash: "teacher123",
        department: "Electronics",
        subjects: ["Digital Electronics", "Microprocessors", "Circuit Design"],
        phone: "+1234567903",
        address: "321 Campus Drive, University City",
        dateOfBirth: "1975-05-30",
        gender: "Male",
        qualification: "M.Tech in Electronics",
        experience: "15 years",
        joiningDate: "2015-07-20",
        emergencyContact: "Mary Wilson",
        emergencyPhone: "+1234567996",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
      {
        id: 5,
        name: "Dr. Lisa Anderson",
        employeeId: "T005",
        email: "lisa.anderson@university.edu",
        passwordHash: "teacher123",
        department: "Mechanical",
        subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
        phone: "+1234567904",
        address: "654 Scholar Street, University City",
        dateOfBirth: "1982-09-12",
        gender: "Female",
        qualification: "Ph.D. in Mechanical Engineering",
        experience: "10 years",
        joiningDate: "2019-03-15",
        emergencyContact: "Robert Anderson",
        emergencyPhone: "+1234567995",
        createdAt: "2024-01-01T00:00:00Z",
        isActive: true,
      },
    ]

    this.initialized = true
    console.log(`Teacher database initialized with ${this.teachers.length} teachers`)
    console.log(
      "Available teachers:",
      this.teachers.map((t) => `${t.name} (${t.employeeId})`),
    )
  }

  // Teacher Authentication with enhanced recognition
  async authenticateTeacher(credentials: TeacherLoginCredentials): Promise<Teacher | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teacher = this.teachers.find(
          (t) =>
            (t.employeeId.toLowerCase() === credentials.identifier.toLowerCase() ||
              t.email.toLowerCase() === credentials.identifier.toLowerCase()) &&
            t.passwordHash === credentials.password &&
            t.isActive,
        )

        if (teacher) {
          console.log(`✅ Teacher authenticated successfully: ${teacher.name} (${teacher.employeeId})`)
          console.log(`Department: ${teacher.department}, Subjects: ${teacher.subjects.join(", ")}`)
          resolve({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          })
        } else {
          console.log(`❌ Teacher authentication failed for: ${credentials.identifier}`)
          resolve(null)
        }
      }, 500)
    })
  }

  // Enhanced Teacher Registration with full data persistence
  async registerTeacher(data: TeacherRegistrationData): Promise<Teacher> {
    await this.initializeDatabase()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for existing teacher with comprehensive validation
        const existingTeacher = this.teachers.find(
          (t) =>
            t.employeeId.toLowerCase() === data.employeeId.toLowerCase() ||
            t.email.toLowerCase() === data.email.toLowerCase(),
        )

        if (existingTeacher) {
          const errorMsg = `Teacher registration failed: ${
            existingTeacher.employeeId.toLowerCase() === data.employeeId.toLowerCase()
              ? `Employee ID ${data.employeeId}`
              : `Email ${data.email}`
          } already exists`
          console.log(`❌ ${errorMsg}`)
          reject(new Error("Teacher with this employee ID or email already exists"))
          return
        }

        const newTeacher = {
          id: Math.max(...this.teachers.map((t) => t.id), 0) + 1,
          name: data.name,
          employeeId: data.employeeId.toUpperCase(),
          email: data.email.toLowerCase(),
          passwordHash: data.password, // In production, hash this properly
          department: data.department,
          subjects: data.subjects,
          phone: data.phone,
          address: data.address,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          qualification: data.qualification,
          experience: data.experience,
          joiningDate: data.joiningDate,
          emergencyContact: data.emergencyContact,
          emergencyPhone: data.emergencyPhone,
          createdAt: new Date().toISOString(),
          isActive: true,
        }

        this.teachers.push(newTeacher)
        console.log(`✅ New teacher registered successfully: ${newTeacher.name} (${newTeacher.employeeId})`)
        console.log(`Department: ${newTeacher.department}, Subjects: ${newTeacher.subjects.join(", ")}`)
        console.log(`Total teachers in system: ${this.teachers.length}`)

        resolve({
          id: newTeacher.id,
          name: newTeacher.name,
          employeeId: newTeacher.employeeId,
          email: newTeacher.email,
          department: newTeacher.department,
          subjects: newTeacher.subjects,
          phone: newTeacher.phone,
          address: newTeacher.address,
          dateOfBirth: newTeacher.dateOfBirth,
          gender: newTeacher.gender,
          qualification: newTeacher.qualification,
          experience: newTeacher.experience,
          joiningDate: newTeacher.joiningDate,
          emergencyContact: newTeacher.emergencyContact,
          emergencyPhone: newTeacher.emergencyPhone,
          createdAt: newTeacher.createdAt,
          isActive: newTeacher.isActive,
        })
      }, 200)
    })
  }

  // Get all teachers with full information
  async getAllTeachers(): Promise<Teacher[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teachers = this.teachers
          .filter((t) => t.isActive)
          .map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          }))
          .sort((a, b) => a.employeeId.localeCompare(b.employeeId))

        console.log(`📊 Retrieved ${teachers.length} active teachers`)
        resolve(teachers)
      }, 100)
    })
  }

  // Get teacher by ID with full recognition
  async getTeacherById(id: number): Promise<Teacher | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teacher = this.teachers.find((t) => t.id === id && t.isActive)
        if (teacher) {
          console.log(`🔍 Teacher found by ID ${id}: ${teacher.name} (${teacher.employeeId})`)
          resolve({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          })
        } else {
          console.log(`❌ Teacher not found with ID: ${id}`)
          resolve(null)
        }
      }, 100)
    })
  }

  // Get teacher by employee ID
  async getTeacherByEmployeeId(employeeId: string): Promise<Teacher | null> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teacher = this.teachers.find((t) => t.employeeId.toLowerCase() === employeeId.toLowerCase() && t.isActive)
        if (teacher) {
          console.log(`🔍 Teacher found by Employee ID ${employeeId}: ${teacher.name}`)
          resolve({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          })
        } else {
          console.log(`❌ Teacher not found with Employee ID: ${employeeId}`)
          resolve(null)
        }
      }, 100)
    })
  }

  // Get teachers by department with recognition
  async getTeachersByDepartment(department: string): Promise<Teacher[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teachers = this.teachers
          .filter((t) => t.isActive && t.department.toLowerCase() === department.toLowerCase())
          .map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          }))
          .sort((a, b) => a.employeeId.localeCompare(b.employeeId))

        console.log(`🏢 Found ${teachers.length} teachers in ${department} department`)
        resolve(teachers)
      }, 100)
    })
  }

  // Enhanced search with comprehensive recognition
  async searchTeachers(query: string): Promise<Teacher[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase()
        const results = this.teachers
          .filter((t) => t.isActive)
          .filter(
            (teacher) =>
              teacher.name.toLowerCase().includes(searchTerm) ||
              teacher.employeeId.toLowerCase().includes(searchTerm) ||
              teacher.email.toLowerCase().includes(searchTerm) ||
              teacher.department.toLowerCase().includes(searchTerm) ||
              teacher.subjects.some((subject: string) => subject.toLowerCase().includes(searchTerm)) ||
              (teacher.qualification && teacher.qualification.toLowerCase().includes(searchTerm)),
          )
          .map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        console.log(`🔍 Search for "${query}" returned ${results.length} teachers`)
        resolve(results)
      }, 100)
    })
  }

  // Update teacher information with validation
  async updateTeacher(id: number, updates: Partial<Teacher>): Promise<Teacher | null> {
    await this.initializeDatabase()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.teachers.findIndex((t) => t.id === id)
        if (index === -1) {
          console.log(`❌ Teacher update failed: Teacher with ID ${id} not found`)
          resolve(null)
          return
        }

        // Check for conflicts if updating email or employeeId
        if (updates.email || updates.employeeId) {
          const conflictTeacher = this.teachers.find(
            (t, i) =>
              i !== index &&
              t.isActive &&
              ((updates.email && t.email.toLowerCase() === updates.email.toLowerCase()) ||
                (updates.employeeId && t.employeeId.toLowerCase() === updates.employeeId.toLowerCase())),
          )

          if (conflictTeacher) {
            const errorMsg = `Update failed: ${updates.email ? "Email" : "Employee ID"} already exists`
            console.log(`❌ ${errorMsg}`)
            reject(new Error(errorMsg))
            return
          }
        }

        const oldTeacher = { ...this.teachers[index] }
        this.teachers[index] = { ...this.teachers[index], ...updates }
        const updatedTeacher = this.teachers[index]

        console.log(`✅ Teacher updated successfully: ${updatedTeacher.name} (${updatedTeacher.employeeId})`)
        console.log(`Changes: ${Object.keys(updates).join(", ")}`)

        resolve({
          id: updatedTeacher.id,
          name: updatedTeacher.name,
          employeeId: updatedTeacher.employeeId,
          email: updatedTeacher.email,
          department: updatedTeacher.department,
          subjects: updatedTeacher.subjects,
          phone: updatedTeacher.phone,
          address: updatedTeacher.address,
          dateOfBirth: updatedTeacher.dateOfBirth,
          gender: updatedTeacher.gender,
          qualification: updatedTeacher.qualification,
          experience: updatedTeacher.experience,
          joiningDate: updatedTeacher.joiningDate,
          emergencyContact: updatedTeacher.emergencyContact,
          emergencyPhone: updatedTeacher.emergencyPhone,
          createdAt: updatedTeacher.createdAt,
          isActive: updatedTeacher.isActive,
        })
      }, 100)
    })
  }

  // Get comprehensive teacher statistics
  async getTeacherStats(): Promise<TeacherStats> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const activeTeachers = this.teachers.filter((t) => t.isActive)
        const totalTeachers = this.teachers.length

        // Department count
        const departmentCount: { [key: string]: number } = {}
        activeTeachers.forEach((teacher) => {
          departmentCount[teacher.department] = (departmentCount[teacher.department] || 0) + 1
        })

        // Subject count
        const subjectCount: { [key: string]: number } = {}
        activeTeachers.forEach((teacher) => {
          teacher.subjects.forEach((subject: string) => {
            subjectCount[subject] = (subjectCount[subject] || 0) + 1
          })
        })

        // Average experience calculation
        const teachersWithExperience = activeTeachers.filter((t) => t.experience)
        const totalExperience = teachersWithExperience.reduce((sum, teacher) => {
          const years = Number.parseInt(teacher.experience?.replace(/\D/g, "") || "0")
          return sum + years
        }, 0)
        const averageExperience =
          teachersWithExperience.length > 0 ? Math.round(totalExperience / teachersWithExperience.length) : 0

        const stats = {
          totalTeachers,
          activeTeachers: activeTeachers.length,
          departmentCount,
          subjectCount,
          averageExperience,
        }

        console.log(`📊 Teacher Statistics:`)
        console.log(`- Total Teachers: ${stats.totalTeachers}`)
        console.log(`- Active Teachers: ${stats.activeTeachers}`)
        console.log(`- Departments: ${Object.keys(departmentCount).length}`)
        console.log(`- Subjects Covered: ${Object.keys(subjectCount).length}`)
        console.log(`- Average Experience: ${averageExperience} years`)

        resolve(stats)
      }, 100)
    })
  }

  // Get teachers by subject
  async getTeachersBySubject(subject: string): Promise<Teacher[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teachers = this.teachers
          .filter((t) => t.isActive && t.subjects.some((s: string) => s.toLowerCase() === subject.toLowerCase()))
          .map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            employeeId: teacher.employeeId,
            email: teacher.email,
            department: teacher.department,
            subjects: teacher.subjects,
            phone: teacher.phone,
            address: teacher.address,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            qualification: teacher.qualification,
            experience: teacher.experience,
            joiningDate: teacher.joiningDate,
            emergencyContact: teacher.emergencyContact,
            emergencyPhone: teacher.emergencyPhone,
            createdAt: teacher.createdAt,
            isActive: teacher.isActive,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        console.log(`📚 Found ${teachers.length} teachers for subject: ${subject}`)
        resolve(teachers)
      }, 100)
    })
  }

  // Verify teacher credentials (for additional security checks)
  async verifyTeacher(employeeId: string, email: string): Promise<boolean> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const teacher = this.teachers.find(
          (t) =>
            t.isActive &&
            t.employeeId.toLowerCase() === employeeId.toLowerCase() &&
            t.email.toLowerCase() === email.toLowerCase(),
        )

        const isVerified = !!teacher
        console.log(`🔐 Teacher verification for ${employeeId}: ${isVerified ? "PASSED" : "FAILED"}`)
        resolve(isVerified)
      }, 100)
    })
  }

  // Get all unique departments
  async getDepartments(): Promise<string[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = [...new Set(this.teachers.filter((t) => t.isActive).map((t) => t.department))].sort()

        console.log(`🏢 Available departments: ${departments.join(", ")}`)
        resolve(departments)
      }, 100)
    })
  }

  // Get all unique subjects
  async getSubjects(): Promise<string[]> {
    await this.initializeDatabase()

    return new Promise((resolve) => {
      setTimeout(() => {
        const subjects = [...new Set(this.teachers.filter((t) => t.isActive).flatMap((t) => t.subjects))].sort()

        console.log(`📚 Available subjects: ${subjects.length} subjects`)
        resolve(subjects)
      }, 100)
    })
  }
}

// Export singleton instance
export const teacherDatabase = new TeacherDatabase()

// Utility functions for teacher management
export const formatTeacherExperience = (experience?: string): string => {
  if (!experience) return "Not specified"
  return experience.includes("year") ? experience : `${experience} years`
}

export const getTeacherDisplayName = (teacher: Teacher): string => {
  const title = teacher.qualification?.includes("Ph.D") ? "Dr." : "Prof."
  return `${title} ${teacher.name}`
}

export const calculateTeacherAge = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const getTeacherSubjectCount = (teacher: Teacher): number => {
  return teacher.subjects.length
}

export const isTeacherQualifiedForSubject = (teacher: Teacher, subject: string): boolean => {
  return teacher.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())
}
