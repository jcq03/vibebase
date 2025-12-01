-- Add description and features columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS features TEXT;