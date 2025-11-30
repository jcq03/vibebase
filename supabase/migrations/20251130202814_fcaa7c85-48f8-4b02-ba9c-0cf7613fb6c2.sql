-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  section TEXT NOT NULL,
  video_url TEXT,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user course progress table
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Courses policies (public read)
CREATE POLICY "Anyone can view courses"
ON public.courses
FOR SELECT
USING (true);

-- User progress policies
CREATE POLICY "Users can view their own progress"
ON public.user_course_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_course_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_course_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Insert sample courses
INSERT INTO public.courses (title, section, description, order_index) VALUES
('Introduction to Fundamentals', 'Fundamentals', 'Learn the basic concepts', 1),
('Core Principles', 'Fundamentals', 'Understanding core principles', 2),
('Getting Started', 'Fundamentals', 'Your first steps', 3),
('Work Methodology', 'Build Work Properly', 'How to structure your work', 1),
('Quality Standards', 'Build Work Properly', 'Maintaining high quality', 2),
('Best Practices', 'Build Work Properly', 'Industry best practices', 3),
('Planning Your Build', 'How to Build', 'Project planning essentials', 1),
('Development Process', 'How to Build', 'Step by step development', 2),
('Testing & Deployment', 'How to Build', 'Launch your project', 3),
('Marketing Basics', 'How to Market', 'Introduction to marketing', 1),
('Content Strategy', 'How to Market', 'Creating effective content', 2),
('Growth Tactics', 'How to Market', 'Scaling your reach', 3);

-- Create indexes
CREATE INDEX idx_courses_section ON public.courses(section, order_index);
CREATE INDEX idx_user_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON public.user_course_progress(course_id);