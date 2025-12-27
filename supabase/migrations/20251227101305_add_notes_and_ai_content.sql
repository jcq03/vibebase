-- Add notes and ai_content columns to projects table for full whiteboard persistence
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ai_content JSONB DEFAULT '{}'::jsonb;

-- Add comment for clarity
COMMENT ON COLUMN public.projects.notes IS 'Stores sticky note cards attached to whiteboard cards';
COMMENT ON COLUMN public.projects.ai_content IS 'Stores AI-generated content for each whiteboard card';

