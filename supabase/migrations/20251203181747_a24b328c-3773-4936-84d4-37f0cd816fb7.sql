-- Fix 1: Remove overly permissive waitlist SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view waitlist" ON public.waitlist;

-- Fix 2: Replace calls SELECT policy to only allow viewing own calls or joined calls
DROP POLICY IF EXISTS "Users can view all calls" ON public.calls;

CREATE POLICY "Users can view relevant calls" ON public.calls
FOR SELECT USING (
  user_id = auth.uid() OR
  id IN (SELECT call_id FROM public.call_participants WHERE user_id = auth.uid())
);

-- Fix 3: Replace call_participants SELECT policy to only allow viewing participants of relevant calls
DROP POLICY IF EXISTS "Anyone can view call participants" ON public.call_participants;

CREATE POLICY "Users can view participants of relevant calls" ON public.call_participants
FOR SELECT USING (
  call_id IN (SELECT id FROM public.calls WHERE user_id = auth.uid()) OR
  call_id IN (SELECT call_id FROM public.call_participants WHERE user_id = auth.uid())
);