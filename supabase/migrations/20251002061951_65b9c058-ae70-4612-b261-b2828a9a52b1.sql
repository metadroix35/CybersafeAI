-- Drop the overly permissive policy on security_metrics
DROP POLICY IF EXISTS "Authenticated users can view security metrics" ON public.security_metrics;

-- Create a new restrictive policy that only allows security personnel to view metrics
CREATE POLICY "Security personnel can view security metrics"
ON public.security_metrics
FOR SELECT
TO authenticated
USING (public.is_security_personnel(auth.uid()));