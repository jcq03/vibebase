-- Create waitlist table for email signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up (public insert)
CREATE POLICY "Anyone can sign up for waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view waitlist entries
CREATE POLICY "Authenticated users can view waitlist"
ON public.waitlist
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at DESC);