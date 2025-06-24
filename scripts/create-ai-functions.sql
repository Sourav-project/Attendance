-- AI Assistant Database Functions
-- This script creates functions for AI assistant operations

-- Function to log AI conversations
CREATE OR REPLACE FUNCTION log_ai_conversation(
    p_session_id VARCHAR(255),
    p_user_type VARCHAR(50),
    p_user_id INTEGER,
    p_user_name VARCHAR(255),
    p_message_role VARCHAR(20),
    p_message_content TEXT,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_tokens_used INTEGER DEFAULT NULL,
    p_model_used VARCHAR(100) DEFAULT 'gpt-4o'
) RETURNS INTEGER AS $$
DECLARE
    conversation_id INTEGER;
BEGIN
    INSERT INTO ai_conversations (
        session_id, user_type, user_id, user_name, message_role, 
        message_content, response_time_ms, tokens_used, model_used
    ) VALUES (
        p_session_id, p_user_type, p_user_id, p_user_name, p_message_role,
        p_message_content, p_response_time_ms, p_tokens_used, p_model_used
    ) RETURNING id INTO conversation_id;
    
    RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_ai_analytics(p_date DATE DEFAULT CURRENT_DATE) 
RETURNS VOID AS $$
BEGIN
    INSERT INTO ai_analytics (
        date, total_conversations, total_messages, unique_users,
        student_interactions, teacher_interactions, guest_interactions,
        avg_response_time_ms, total_tokens_used
    )
    SELECT 
        p_date,
        COUNT(DISTINCT session_id),
        COUNT(*),
        COUNT(DISTINCT COALESCE(user_id::TEXT, session_id)),
        COUNT(DISTINCT CASE WHEN user_type = 'student' THEN session_id END),
        COUNT(DISTINCT CASE WHEN user_type = 'teacher' THEN session_id END),
        COUNT(DISTINCT CASE WHEN user_type = 'guest' THEN session_id END),
        AVG(response_time_ms),
        SUM(COALESCE(tokens_used, 0))
    FROM ai_conversations 
    WHERE DATE(message_timestamp) = p_date
    ON CONFLICT (date) DO UPDATE SET
        total_conversations = EXCLUDED.total_conversations,
        total_messages = EXCLUDED.total_messages,
        unique_users = EXCLUDED.unique_users,
        student_interactions = EXCLUDED.student_interactions,
        teacher_interactions = EXCLUDED.teacher_interactions,
        guest_interactions = EXCLUDED.guest_interactions,
        avg_response_time_ms = EXCLUDED.avg_response_time_ms,
        total_tokens_used = EXCLUDED.total_tokens_used,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to search knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_base(
    p_query TEXT,
    p_user_type VARCHAR(50) DEFAULT 'both',
    p_limit INTEGER DEFAULT 5
) RETURNS TABLE(
    id INTEGER,
    question TEXT,
    answer TEXT,
    category VARCHAR(100),
    effectiveness_score DECIMAL(3,2),
    relevance_score DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id,
        kb.question,
        kb.answer,
        kb.category,
        kb.effectiveness_score,
        -- Simple relevance scoring based on keyword matches and text similarity
        CASE 
            WHEN kb.keywords && string_to_array(lower(p_query), ' ') THEN 1.0
            WHEN lower(kb.question) LIKE '%' || lower(p_query) || '%' THEN 0.8
            WHEN lower(kb.answer) LIKE '%' || lower(p_query) || '%' THEN 0.6
            ELSE 0.3
        END::DECIMAL(3,2) as relevance_score
    FROM ai_knowledge_base kb
    WHERE kb.is_active = true
    AND (kb.user_type = p_user_type OR kb.user_type = 'both')
    AND (
        kb.keywords && string_to_array(lower(p_query), ' ')
        OR lower(kb.question) LIKE '%' || lower(p_query) || '%'
        OR lower(kb.answer) LIKE '%' || lower(p_query) || '%'
    )
    ORDER BY relevance_score DESC, kb.effectiveness_score DESC, kb.usage_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to record user feedback
CREATE OR REPLACE FUNCTION record_ai_feedback(
    p_session_id VARCHAR(255),
    p_user_type VARCHAR(50),
    p_user_id INTEGER,
    p_rating INTEGER,
    p_feedback_text TEXT DEFAULT NULL,
    p_was_helpful BOOLEAN DEFAULT NULL,
    p_issue_resolved BOOLEAN DEFAULT NULL,
    p_feedback_category VARCHAR(100) DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    feedback_id INTEGER;
    latest_conversation_id INTEGER;
BEGIN
    -- Get the latest conversation ID for this session
    SELECT id INTO latest_conversation_id
    FROM ai_conversations 
    WHERE session_id = p_session_id 
    ORDER BY message_timestamp DESC 
    LIMIT 1;
    
    INSERT INTO ai_feedback (
        conversation_id, session_id, user_type, user_id, rating,
        feedback_text, was_helpful, issue_resolved, feedback_category
    ) VALUES (
        latest_conversation_id, p_session_id, p_user_type, p_user_id, p_rating,
        p_feedback_text, p_was_helpful, p_issue_resolved, p_feedback_category
    ) RETURNING id INTO feedback_id;
    
    RETURN feedback_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update popular topics
CREATE OR REPLACE FUNCTION update_popular_topics(
    p_topic VARCHAR(255),
    p_category VARCHAR(100)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO ai_popular_topics (topic, category, mention_count, last_mentioned)
    VALUES (p_topic, p_category, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (topic, category) DO UPDATE SET
        mention_count = ai_popular_topics.mention_count + 1,
        last_mentioned = CURRENT_TIMESTAMP,
        trending_score = ai_popular_topics.mention_count * 0.1 + 
                        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ai_popular_topics.created_at)) / 86400 * 0.01;
END;
$$ LANGUAGE plpgsql;

-- Function to get AI assistant statistics
CREATE OR REPLACE FUNCTION get_ai_statistics(p_days INTEGER DEFAULT 30)
RETURNS TABLE(
    total_conversations BIGINT,
    total_messages BIGINT,
    avg_response_time DECIMAL(10,2),
    user_satisfaction DECIMAL(3,2),
    top_category VARCHAR(100),
    daily_average DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT ac.session_id)::BIGINT as total_conversations,
        COUNT(ac.id)::BIGINT as total_messages,
        AVG(ac.response_time_ms)::DECIMAL(10,2) as avg_response_time,
        COALESCE(AVG(af.rating), 0)::DECIMAL(3,2) as user_satisfaction,
        (SELECT category FROM ai_popular_topics ORDER BY trending_score DESC LIMIT 1) as top_category,
        (COUNT(DISTINCT ac.session_id)::DECIMAL / p_days)::DECIMAL(10,2) as daily_average
    FROM ai_conversations ac
    LEFT JOIN ai_feedback af ON af.session_id = ac.session_id
    WHERE ac.message_timestamp >= CURRENT_DATE - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old conversations (data retention)
CREATE OR REPLACE FUNCTION cleanup_old_ai_data(p_days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete old conversations
    DELETE FROM ai_conversations 
    WHERE message_timestamp < CURRENT_DATE - INTERVAL '1 day' * p_days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old analytics (keep longer - 1 year)
    DELETE FROM ai_analytics 
    WHERE date < CURRENT_DATE - INTERVAL '1 year';
    
    -- Delete old feedback
    DELETE FROM ai_feedback 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * p_days_to_keep;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update analytics daily
CREATE OR REPLACE FUNCTION trigger_update_ai_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics for the current date
    PERFORM update_ai_analytics(CURRENT_DATE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on ai_conversations table
DROP TRIGGER IF EXISTS ai_analytics_trigger ON ai_conversations;
CREATE TRIGGER ai_analytics_trigger
    AFTER INSERT ON ai_conversations
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_update_ai_analytics();

COMMENT ON FUNCTION log_ai_conversation IS 'Logs AI assistant conversations for analytics and improvement';
COMMENT ON FUNCTION update_ai_analytics IS 'Updates daily analytics for AI assistant usage';
COMMENT ON FUNCTION search_knowledge_base IS 'Searches knowledge base for relevant answers';
COMMENT ON FUNCTION record_ai_feedback IS 'Records user feedback on AI assistant responses';
COMMENT ON FUNCTION update_popular_topics IS 'Tracks and updates popular discussion topics';
COMMENT ON FUNCTION get_ai_statistics IS 'Returns comprehensive AI assistant statistics';
COMMENT ON FUNCTION cleanup_old_ai_data IS 'Cleans up old AI data for storage management';
