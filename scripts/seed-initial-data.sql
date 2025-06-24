-- Insert sample classes
INSERT INTO classes (class_name, department, year, total_students) VALUES
('Computer Science', 'Engineering', '1st Year', 45),
('Computer Science', 'Engineering', '2nd Year', 42),
('Computer Science', 'Engineering', '3rd Year', 38),
('Computer Science', 'Engineering', '4th Year', 35),
('Information Technology', 'Engineering', '1st Year', 40),
('Information Technology', 'Engineering', '2nd Year', 38),
('Electronics', 'Engineering', '1st Year', 35),
('Mechanical', 'Engineering', '1st Year', 50);

-- Insert sample subjects
INSERT INTO subjects (subject_name, subject_code, class_id, credits) VALUES
('Data Structures', 'CS201', 1, 4),
('Database Management', 'CS202', 1, 3),
('Computer Networks', 'CS203', 1, 3),
('Operating Systems', 'CS204', 1, 4),
('Software Engineering', 'CS301', 2, 3),
('Web Development', 'CS302', 2, 4),
('Machine Learning', 'CS401', 3, 4),
('Artificial Intelligence', 'CS402', 3, 3);

-- Insert sample students with hashed passwords (in real app, use proper hashing)
INSERT INTO students (name, roll_no, email, password_hash, class, year, phone, address, date_of_birth, gender, guardian_name, guardian_phone) VALUES
('Alice Johnson', 'CS001', 'alice.johnson@university.edu', '$2b$10$hash1', 'Computer Science', '3rd Year', '+1234567890', '123 Main St, City', '2002-05-15', 'Female', 'Robert Johnson', '+1234567891'),
('Bob Smith', 'CS002', 'bob.smith@university.edu', '$2b$10$hash2', 'Computer Science', '3rd Year', '+1234567892', '456 Oak Ave, City', '2002-03-22', 'Male', 'Mary Smith', '+1234567893'),
('Carol Davis', 'CS003', 'carol.davis@university.edu', '$2b$10$hash3', 'Computer Science', '3rd Year', '+1234567894', '789 Pine St, City', '2002-07-08', 'Female', 'John Davis', '+1234567895'),
('David Wilson', 'CS004', 'david.wilson@university.edu', '$2b$10$hash4', 'Computer Science', '3rd Year', '+1234567896', '321 Elm St, City', '2002-01-30', 'Male', 'Sarah Wilson', '+1234567897'),
('Emma Brown', 'CS005', 'emma.brown@university.edu', '$2b$10$hash5', 'Computer Science', '3rd Year', '+1234567898', '654 Maple Ave, City', '2002-09-12', 'Female', 'Michael Brown', '+1234567899'),
('Frank Miller', 'CS006', 'frank.miller@university.edu', '$2b$10$hash6', 'Computer Science', '2nd Year', '+1234567800', '987 Cedar St, City', '2003-04-18', 'Male', 'Lisa Miller', '+1234567801'),
('Grace Lee', 'CS007', 'grace.lee@university.edu', '$2b$10$hash7', 'Computer Science', '2nd Year', '+1234567802', '147 Birch Ave, City', '2003-06-25', 'Female', 'James Lee', '+1234567803'),
('Henry Taylor', 'CS008', 'henry.taylor@university.edu', '$2b$10$hash8', 'Computer Science', '1st Year', '+1234567804', '258 Spruce St, City', '2004-02-14', 'Male', 'Anna Taylor', '+1234567805'),
('Ivy Chen', 'IT001', 'ivy.chen@university.edu', '$2b$10$hash9', 'Information Technology', '2nd Year', '+1234567806', '369 Willow Ave, City', '2003-08-07', 'Female', 'David Chen', '+1234567807'),
('Jack Rodriguez', 'IT002', 'jack.rodriguez@university.edu', '$2b$10$hash10', 'Information Technology', '1st Year', '+1234567808', '741 Poplar St, City', '2004-11-03', 'Male', 'Maria Rodriguez', '+1234567809');

-- Insert sample attendance records
INSERT INTO attendance (student_id, date, time_in, status, subject, location, marked_by) VALUES
-- Alice Johnson attendance
(1, '2024-01-15', '2024-01-15 09:00:00', 'present', 'Data Structures', 'Room 101', 1),
(1, '2024-01-16', '2024-01-16 09:00:00', 'present', 'Database Management', 'Room 102', 1),
(1, '2024-01-17', '2024-01-17 09:00:00', 'absent', 'Computer Networks', 'Room 103', NULL),
(1, '2024-01-18', '2024-01-18 09:00:00', 'present', 'Operating Systems', 'Room 104', 1),
(1, '2024-01-19', '2024-01-19 09:00:00', 'present', 'Software Engineering', 'Room 105', 1),

-- Bob Smith attendance
(2, '2024-01-15', '2024-01-15 09:05:00', 'present', 'Data Structures', 'Room 101', 2),
(2, '2024-01-16', '2024-01-16 09:00:00', 'present', 'Database Management', 'Room 102', 2),
(2, '2024-01-17', '2024-01-17 09:00:00', 'present', 'Computer Networks', 'Room 103', 2),
(2, '2024-01-18', '2024-01-18 09:00:00', 'absent', 'Operating Systems', 'Room 104', NULL),
(2, '2024-01-19', '2024-01-19 09:00:00', 'present', 'Software Engineering', 'Room 105', 2),

-- Carol Davis attendance
(3, '2024-01-15', '2024-01-15 08:55:00', 'present', 'Data Structures', 'Room 101', 3),
(3, '2024-01-16', '2024-01-16 09:00:00', 'present', 'Database Management', 'Room 102', 3),
(3, '2024-01-17', '2024-01-17 09:00:00', 'present', 'Computer Networks', 'Room 103', 3),
(3, '2024-01-18', '2024-01-18 09:00:00', 'present', 'Operating Systems', 'Room 104', 3),
(3, '2024-01-19', '2024-01-19 09:00:00', 'present', 'Software Engineering', 'Room 105', 3),

-- David Wilson attendance
(4, '2024-01-15', '2024-01-15 09:10:00', 'present', 'Data Structures', 'Room 101', 4),
(4, '2024-01-16', '2024-01-16 09:00:00', 'absent', 'Database Management', 'Room 102', NULL),
(4, '2024-01-17', '2024-01-17 09:00:00', 'present', 'Computer Networks', 'Room 103', 4),
(4, '2024-01-18', '2024-01-18 09:00:00', 'present', 'Operating Systems', 'Room 104', 4),
(4, '2024-01-19', '2024-01-19 09:00:00', 'absent', 'Software Engineering', 'Room 105', NULL),

-- Emma Brown attendance (perfect attendance)
(5, '2024-01-15', '2024-01-15 08:50:00', 'present', 'Data Structures', 'Room 101', 5),
(5, '2024-01-16', '2024-01-16 08:55:00', 'present', 'Database Management', 'Room 102', 5),
(5, '2024-01-17', '2024-01-17 09:00:00', 'present', 'Computer Networks', 'Room 103', 5),
(5, '2024-01-18', '2024-01-18 08:58:00', 'present', 'Operating Systems', 'Room 104', 5),
(5, '2024-01-19', '2024-01-19 09:00:00', 'present', 'Software Engineering', 'Room 105', 5);
