-- Function to get student attendance statistics
CREATE OR REPLACE FUNCTION get_student_attendance_stats(student_roll_no VARCHAR)
RETURNS TABLE(
    student_name VARCHAR,
    roll_no VARCHAR,
    total_days BIGINT,
    present_days BIGINT,
    absent_days BIGINT,
    attendance_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name,
        s.roll_no,
        COUNT(a.id) as total_days,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
        ROUND(
            (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / 
             NULLIF(COUNT(a.id), 0)), 2
        ) as attendance_percentage
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id
    WHERE s.roll_no = student_roll_no AND s.is_active = TRUE
    GROUP BY s.id, s.name, s.roll_no;
END;
$$ LANGUAGE plpgsql;

-- Function to mark attendance
CREATE OR REPLACE FUNCTION mark_attendance(
    student_roll_no VARCHAR,
    attendance_date DATE,
    subject_name VARCHAR DEFAULT NULL,
    location_name VARCHAR DEFAULT 'Room 101'
)
RETURNS BOOLEAN AS $$
DECLARE
    student_id_val INTEGER;
BEGIN
    -- Get student ID
    SELECT id INTO student_id_val 
    FROM students 
    WHERE roll_no = student_roll_no AND is_active = TRUE;
    
    IF student_id_val IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Insert or update attendance
    INSERT INTO attendance (student_id, date, time_in, status, subject, location, marked_by)
    VALUES (student_id_val, attendance_date, NOW(), 'present', subject_name, location_name, student_id_val)
    ON CONFLICT (student_id, date, subject) 
    DO UPDATE SET 
        time_in = NOW(),
        status = 'present',
        marked_by = student_id_val;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get class attendance summary
CREATE OR REPLACE FUNCTION get_class_attendance_summary(class_name VARCHAR, year_name VARCHAR)
RETURNS TABLE(
    student_name VARCHAR,
    roll_no VARCHAR,
    total_days BIGINT,
    present_days BIGINT,
    attendance_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name,
        s.roll_no,
        COUNT(a.id) as total_days,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
        ROUND(
            (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / 
             NULLIF(COUNT(a.id), 0)), 2
        ) as attendance_percentage
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id
    WHERE s.class = class_name AND s.year = year_name AND s.is_active = TRUE
    GROUP BY s.id, s.name, s.roll_no
    ORDER BY s.roll_no;
END;
$$ LANGUAGE plpgsql;

-- Function to register new student
CREATE OR REPLACE FUNCTION register_student(
    student_name VARCHAR,
    student_roll_no VARCHAR,
    student_email VARCHAR,
    student_password_hash VARCHAR,
    student_class VARCHAR,
    student_year VARCHAR,
    student_phone VARCHAR DEFAULT NULL,
    student_address TEXT DEFAULT NULL,
    student_dob DATE DEFAULT NULL,
    student_gender VARCHAR DEFAULT NULL,
    guardian_name VARCHAR DEFAULT NULL,
    guardian_phone VARCHAR DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    new_student_id INTEGER;
BEGIN
    INSERT INTO students (
        name, roll_no, email, password_hash, class, year, 
        phone, address, date_of_birth, gender, guardian_name, guardian_phone
    )
    VALUES (
        student_name, student_roll_no, student_email, student_password_hash, 
        student_class, student_year, student_phone, student_address, 
        student_dob, student_gender, guardian_name, guardian_phone
    )
    RETURNING id INTO new_student_id;
    
    RETURN new_student_id;
EXCEPTION
    WHEN unique_violation THEN
        RETURN -1; -- Indicates duplicate roll_no or email
END;
$$ LANGUAGE plpgsql;
