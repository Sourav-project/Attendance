-- AI Assistant Database Schema
-- This script creates tables for storing AI assistant conversations, analytics, and knowledge base

-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'guest', -- 'student', 'teacher', 'guest'
    user_id INTEGER NULL, -- References students.id or teachers.id
    user_name VARCHAR(255) NULL,
    message_role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    message_content TEXT NOT NULL,
    message_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INTEGER NULL, -- Time taken for AI to respond
    tokens_used INTEGER NULL,
    model_used VARCHAR(100) DEFAULT 'gpt-4o',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Analytics Table
CREATE TABLE IF NOT EXISTS ai_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    student_interactions INTEGER DEFAULT 0,
    teacher_interactions INTEGER DEFAULT 0,
    guest_interactions INTEGER DEFAULT 0,
    avg_response_time_ms DECIMAL(10,2) DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    most_common_topic VARCHAR(255) NULL,
    satisfaction_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Common Questions and Answers (Knowledge Base)
CREATE TABLE IF NOT EXISTS ai_knowledge_base (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'attendance', 'login', 'registration', 'technical', 'general'
    user_type VARCHAR(50) DEFAULT 'both', -- 'student', 'teacher', 'both'
    keywords TEXT[], -- Array of keywords for better matching
    usage_count INTEGER DEFAULT 0,
    effectiveness_score DECIMAL(3,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Feedback Table
CREATE TABLE IF NOT EXISTS ai_feedback (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES ai_conversations(id),
    session_id VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'guest',
    user_id INTEGER NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 star rating
    feedback_text TEXT NULL,
    was_helpful BOOLEAN NULL,
    issue_resolved BOOLEAN NULL,
    feedback_category VARCHAR(100) NULL, -- 'accuracy', 'speed', 'helpfulness', 'clarity'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Assistant Settings Table
CREATE TABLE IF NOT EXISTS ai_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Popular Topics Table
CREATE TABLE IF NOT EXISTS ai_popular_topics (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    mention_count INTEGER DEFAULT 1,
    last_mentioned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trending_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(topic, category)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_type, user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_timestamp ON ai_conversations(message_timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_date ON ai_analytics(date);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_category ON ai_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_keywords ON ai_knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_rating ON ai_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_ai_popular_topics_trending ON ai_popular_topics(trending_score DESC);

-- Create views for common queries
CREATE OR REPLACE VIEW ai_conversation_summary AS
SELECT 
    session_id,
    user_type,
    user_name,
    COUNT(*) as message_count,
    MIN(message_timestamp) as conversation_start,
    MAX(message_timestamp) as conversation_end,
    AVG(response_time_ms) as avg_response_time,
    SUM(tokens_used) as total_tokens
FROM ai_conversations 
GROUP BY session_id, user_type, user_name;

CREATE OR REPLACE VIEW ai_daily_stats AS
SELECT 
    DATE(message_timestamp) as date,
    COUNT(DISTINCT session_id) as unique_conversations,
    COUNT(*) as total_messages,
    COUNT(DISTINCT CASE WHEN user_type = 'student' THEN session_id END) as student_conversations,
    COUNT(DISTINCT CASE WHEN user_type = 'teacher' THEN session_id END) as teacher_conversations,
    COUNT(DISTINCT CASE WHEN user_type = 'guest' THEN session_id END) as guest_conversations,
    AVG(response_time_ms) as avg_response_time,
    SUM(tokens_used) as total_tokens_used
FROM ai_conversations 
WHERE message_role = 'assistant'
GROUP BY DATE(message_timestamp)
ORDER BY date DESC;

CREATE OR REPLACE VIEW ai_top_categories AS
SELECT 
    category,
    COUNT(*) as question_count,
    AVG(effectiveness_score) as avg_effectiveness,
    SUM(usage_count) as total_usage
FROM ai_knowledge_base 
WHERE is_active = true
GROUP BY category
ORDER BY total_usage DESC;

-- Insert default AI settings
INSERT INTO ai_settings (setting_key, setting_value, setting_type, description) VALUES
('max_response_length', '500', 'number', 'Maximum number of tokens for AI responses'),
('response_temperature', '0.7', 'number', 'AI response creativity level (0-1)'),
('enable_analytics', 'true', 'boolean', 'Enable conversation analytics tracking'),
('enable_feedback', 'true', 'boolean', 'Enable user feedback collection'),
('default_model', 'gpt-4o', 'string', 'Default AI model to use'),
('enable_knowledge_base', 'true', 'boolean', 'Use knowledge base for common questions'),
('conversation_timeout_minutes', '30', 'number', 'Minutes before conversation expires'),
('max_daily_messages_per_user', '100', 'number', 'Maximum messages per user per day')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert initial knowledge base entries
INSERT INTO ai_knowledge_base (question, answer, category, user_type, keywords) VALUES
('How do I mark my attendance?', 'To mark your attendance: 1) Log in to your student portal using your roll number and password, 2) Click on "Mark Attendance" button, 3) Select the subject/class, 4) Click "Mark Present" - your attendance will be recorded with timestamp. You can only mark attendance once per day per subject.', 'attendance', 'student', ARRAY['mark', 'attendance', 'present', 'how to']),

('I forgot my password', 'If you forgot your password: 1) Go to the login page, 2) Click "Forgot Password" link, 3) Enter your roll number or email, 4) Check your email for reset instructions, 5) Follow the link to create a new password. If you still have issues, contact your system administrator.', 'login', 'both', ARRAY['password', 'forgot', 'reset', 'login']),

('How do I view attendance reports?', 'To view attendance reports as a teacher: 1) Log in to your teacher portal, 2) Go to "Teacher Dashboard", 3) Use the search and filter options to find specific students or classes, 4) Click "View Details" for detailed attendance records, 5) Use "Export" to download reports. You can filter by date range, class, or subject.', 'reports', 'teacher', ARRAY['reports', 'view', 'attendance', 'teacher', 'dashboard']),

('Why is my attendance percentage low?', 'Your attendance percentage is calculated as: (Present Days ÷ Total Days) × 100. To improve it: 1) Make sure to mark attendance daily, 2) Arrive on time for classes, 3) Check if you missed marking attendance on any days, 4) Contact your teacher if there are any errors in your records.', 'attendance', 'student', ARRAY['percentage', 'low', 'calculate', 'improve']),

('How do I register as a new student?', 'To register as a new student: 1) Go to the home page, 2) Click "Student Portal", 3) Click "Register New Student", 4) Fill in all required information (name, roll number, email, class, etc.), 5) Create a secure password, 6) Submit the form, 7) You can now log in with your credentials.', 'registration', 'student', ARRAY['register', 'new', 'student', 'signup']),

('How does the teacher dashboard work?', 'The teacher dashboard allows you to: 1) View all student attendance records, 2) Search students by name, roll number, or class, 3) Filter by date ranges and subjects, 4) Generate attendance reports, 5) View attendance statistics and analytics, 6) Export data to Excel/PDF, 7) Manage your profile and subjects taught.', 'dashboard', 'teacher', ARRAY['dashboard', 'teacher', 'features', 'how to use']),

('Can I mark attendance from my mobile phone?', 'Yes! The attendance system is fully responsive and works on mobile devices. Simply: 1) Open your mobile browser, 2) Go to the attendance system website, 3) Log in with your credentials, 4) Mark attendance as usual. The interface adapts to your screen size for easy use.', 'technical', 'both', ARRAY['mobile', 'phone', 'responsive', 'device']),

('What if I marked attendance by mistake?', 'If you marked attendance by mistake: 1) Contact your teacher or system administrator immediately, 2) Explain the situation and provide details, 3) They can review and correct the attendance record if necessary, 4) Note that students cannot directly edit their attendance once marked for security reasons.', 'attendance', 'student', ARRAY['mistake', 'wrong', 'correct', 'edit']),

('How secure is my data?', 'Your data is highly secure: 1) All passwords are encrypted, 2) Secure login with session management, 3) Data is stored in protected databases, 4) Regular security updates and monitoring, 5) Access controls ensure only authorized users can view data, 6) No personal data is shared with third parties.', 'security', 'both', ARRAY['security', 'data', 'safe', 'privacy']),

('How do I change my profile information?', 'To update your profile: 1) Log in to your portal, 2) Look for "Profile" or "Settings" section, 3) Click "Edit Profile", 4) Update the information you want to change, 5) Save your changes. Note: Some information like roll number may require administrator approval to change.', 'profile', 'both', ARRAY['profile', 'edit', 'change', 'update', 'information'])

ON CONFLICT DO NOTHING;

COMMENT ON TABLE ai_conversations IS 'Stores all AI assistant conversations for analytics and improvement';
COMMENT ON TABLE ai_analytics IS 'Daily analytics and statistics for AI assistant usage';
COMMENT ON TABLE ai_knowledge_base IS 'Common questions and answers for faster AI responses';
COMMENT ON TABLE ai_feedback IS 'User feedback on AI assistant responses';
COMMENT ON TABLE ai_settings IS 'Configuration settings for AI assistant behavior';
COMMENT ON TABLE ai_popular_topics IS 'Trending topics and frequently discussed subjects';
