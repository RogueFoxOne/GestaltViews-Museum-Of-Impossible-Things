-- Supabase / Postgres setup notes
CREATE EXTENSION IF NOT EXISTS vector;
-- Example: create a table to use pgvector directly
-- CREATE TABLE IF NOT EXISTS embeddings (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   conversation_id uuid,
--   vector vector(1536),
--   meta jsonb,
--   created_at timestamptz DEFAULT now()
-- );
