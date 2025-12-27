-- Add name, phone, and experience columns to waitlist table for sign-up form
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.waitlist.name IS 'User full name from sign-up form';
COMMENT ON COLUMN public.waitlist.phone IS 'User phone number from sign-up form';
COMMENT ON COLUMN public.waitlist.experience IS 'How long user has been vibe coding';

