-- Create course videos table to store video URLs
CREATE TABLE IF NOT EXISTS public.course_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL UNIQUE,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;

-- Everyone can view course videos
CREATE POLICY "Anyone can view course videos"
ON public.course_videos FOR SELECT
USING (true);

-- Only authenticated users can insert (we'll check admin in the app)
CREATE POLICY "Authenticated users can insert course videos"
ON public.course_videos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update course videos"
ON public.course_videos FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete course videos"
ON public.course_videos FOR DELETE
TO authenticated
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_course_videos_course_id ON public.course_videos(course_id);

