-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'security_analyst', 'viewer');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger function for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
    );
    
    -- Assign default viewer role to new users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'viewer');
    
    RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create security definer function to check user roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to check if user has any security role (admin or security_analyst)
CREATE OR REPLACE FUNCTION public.is_security_personnel(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'security_analyst')
  );
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on threats table
DROP POLICY IF EXISTS "Allow read access to threats" ON public.threats;
DROP POLICY IF EXISTS "Allow insert access to threats" ON public.threats;
DROP POLICY IF EXISTS "Allow update access to threats" ON public.threats;

-- Create secure RLS policies for threats table - CRITICAL SECURITY FIX
CREATE POLICY "Security personnel can view threats"
ON public.threats
FOR SELECT
TO authenticated
USING (public.is_security_personnel(auth.uid()));

CREATE POLICY "Security personnel can insert threats"
ON public.threats
FOR INSERT
TO authenticated
WITH CHECK (public.is_security_personnel(auth.uid()));

CREATE POLICY "Security personnel can update threats"
ON public.threats
FOR UPDATE
TO authenticated
USING (public.is_security_personnel(auth.uid()));

CREATE POLICY "Admins can delete threats"
ON public.threats
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Secure other sensitive tables
DROP POLICY IF EXISTS "Allow read access to incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow insert access to incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow update access to incidents" ON public.incidents;

CREATE POLICY "Security personnel can view incidents"
ON public.incidents
FOR SELECT
TO authenticated
USING (public.is_security_personnel(auth.uid()));

CREATE POLICY "Security personnel can manage incidents"
ON public.incidents
FOR INSERT
TO authenticated
WITH CHECK (public.is_security_personnel(auth.uid()));

CREATE POLICY "Security personnel can update incidents"
ON public.incidents
FOR UPDATE
TO authenticated
USING (public.is_security_personnel(auth.uid()));

-- Network logs - readable by security personnel, insertable by authenticated users (for system logs)
DROP POLICY IF EXISTS "Allow read access to network_logs" ON public.network_logs;
DROP POLICY IF EXISTS "Allow insert access to network_logs" ON public.network_logs;

CREATE POLICY "Security personnel can view network logs"
ON public.network_logs
FOR SELECT
TO authenticated
USING (public.is_security_personnel(auth.uid()));

CREATE POLICY "System can insert network logs"
ON public.network_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Security metrics - viewable by all authenticated users, manageable by security personnel
DROP POLICY IF EXISTS "Allow read access to security_metrics" ON public.security_metrics;
DROP POLICY IF EXISTS "Allow insert access to security_metrics" ON public.security_metrics;

CREATE POLICY "Authenticated users can view security metrics"
ON public.security_metrics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Security personnel can insert security metrics"
ON public.security_metrics
FOR INSERT
TO authenticated
WITH CHECK (public.is_security_personnel(auth.uid()));

-- Monitored assets - secure access
DROP POLICY IF EXISTS "Allow read access to monitored_assets" ON public.monitored_assets;
DROP POLICY IF EXISTS "Allow insert access to monitored_assets" ON public.monitored_assets;
DROP POLICY IF EXISTS "Allow update access to monitored_assets" ON public.monitored_assets;

CREATE POLICY "Security personnel can view monitored assets"
ON public.monitored_assets
FOR SELECT
TO authenticated
USING (public.is_security_personnel(auth.uid()));

CREATE POLICY "Security personnel can manage monitored assets"
ON public.monitored_assets
FOR INSERT
TO authenticated
WITH CHECK (public.is_security_personnel(auth.uid()));

CREATE POLICY "Security personnel can update monitored assets"
ON public.monitored_assets
FOR UPDATE
TO authenticated
USING (public.is_security_personnel(auth.uid()));