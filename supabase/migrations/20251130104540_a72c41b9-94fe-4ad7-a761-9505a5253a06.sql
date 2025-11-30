-- Create calls table
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  meeting_link TEXT,
  max_participants INTEGER DEFAULT 10,
  google_calendar_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create call participants table
CREATE TABLE public.call_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_participants ENABLE ROW LEVEL SECURITY;

-- Policies for calls table
CREATE POLICY "Users can view all calls"
ON public.calls
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own calls"
ON public.calls
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calls"
ON public.calls
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calls"
ON public.calls
FOR DELETE
USING (auth.uid() = user_id);

-- Policies for call participants
CREATE POLICY "Anyone can view call participants"
ON public.call_participants
FOR SELECT
USING (true);

CREATE POLICY "Users can join calls"
ON public.call_participants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave calls they joined"
ON public.call_participants
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_calls_updated_at
BEFORE UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.update_calls_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_calls_user_id ON public.calls(user_id);
CREATE INDEX idx_calls_start_time ON public.calls(start_time);
CREATE INDEX idx_call_participants_call_id ON public.call_participants(call_id);
CREATE INDEX idx_call_participants_user_id ON public.call_participants(user_id);