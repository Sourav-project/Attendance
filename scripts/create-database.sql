-- Create Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    class VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_in TIMESTAMP,
    time_out TIMESTAMP,
    status VARCHAR(20) DEFAULT 'present',
    subject VARCHAR(100),
    location VARCHAR(100),
    marked_by INTEGER REFERENCES students(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date, subject)
);

-- Create Classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    total_students INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    class_id INTEGER REFERENCES classes(id),
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Sessions table for tracking login sessions
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Attendance Statistics view
CREATE OR REPLACE VIEW attendance_stats AS
SELECT 
    s.id,
    s.name,
    s.roll_no,
    s.class,
    s.year,
    COUNT(a.id) as total_days,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
    ROUND(
        (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / 
         NULLIF(COUNT(a.id), 0)), 2
    ) as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
WHERE s.is_active = TRUE
GROUP BY s.id, s.name, s.roll_no, s.class, s.year;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
