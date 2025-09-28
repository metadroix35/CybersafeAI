-- Create enum types for better data integrity
CREATE TYPE threat_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE threat_status AS ENUM ('active', 'investigating', 'resolved', 'false_positive');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'in-progress', 'resolved', 'closed');

-- Create threats table for real-time threat detection
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  severity threat_severity NOT NULL DEFAULT 'medium',
  status threat_status NOT NULL DEFAULT 'active',
  source_ip INET,
  source_host TEXT,
  target_ip INET,
  target_host TEXT,
  description TEXT NOT NULL,
  detection_method TEXT,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create incidents table for security incident management
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  severity threat_severity NOT NULL DEFAULT 'medium',
  status incident_status NOT NULL DEFAULT 'open',
  assignee TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create network_logs table for storing network activity
CREATE TABLE public.network_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_ip INET NOT NULL,
  destination_ip INET NOT NULL,
  source_port INTEGER,
  destination_port INTEGER,
  protocol TEXT,
  bytes_transferred BIGINT,
  packet_count INTEGER,
  flags TEXT[],
  threat_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security_metrics table for storing security KPIs
CREATE TABLE public.security_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(5,2) NOT NULL,
  metric_change DECIMAL(5,2),
  measurement_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monitored_assets table
CREATE TABLE public.monitored_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  ip_address INET,
  hostname TEXT,
  operating_system TEXT,
  status TEXT DEFAULT 'online',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a cybersecurity dashboard)
-- In production, you'd want to restrict these based on user roles
CREATE POLICY "Allow read access to threats" ON public.threats FOR SELECT USING (true);
CREATE POLICY "Allow insert access to threats" ON public.threats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to threats" ON public.threats FOR UPDATE USING (true);

CREATE POLICY "Allow read access to incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Allow insert access to incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to incidents" ON public.incidents FOR UPDATE USING (true);

CREATE POLICY "Allow read access to network_logs" ON public.network_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert access to network_logs" ON public.network_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to security_metrics" ON public.security_metrics FOR SELECT USING (true);
CREATE POLICY "Allow insert access to security_metrics" ON public.security_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to monitored_assets" ON public.monitored_assets FOR SELECT USING (true);
CREATE POLICY "Allow insert access to monitored_assets" ON public.monitored_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to monitored_assets" ON public.monitored_assets FOR UPDATE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_threats_updated_at
  BEFORE UPDATE ON public.threats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monitored_assets_updated_at
  BEFORE UPDATE ON public.monitored_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.threats (type, severity, status, source_ip, description, detection_method, confidence_score) VALUES
('Intrusion Attempt', 'high', 'active', '192.168.1.105', 'Suspicious login attempts detected from external IP', 'AI Behavioral Analysis', 0.95),
('Malware Detection', 'critical', 'investigating', '10.0.0.7', 'Potential malware behavior identified in system processes', 'Signature Detection', 0.89),
('Network Anomaly', 'medium', 'active', '192.168.1.89', 'Unusual data transfer patterns detected', 'Traffic Analysis', 0.72),
('Data Breach Attempt', 'high', 'investigating', '172.16.0.15', 'Unauthorized access attempt to sensitive database', 'Access Control Monitor', 0.91);

INSERT INTO public.incidents (incident_id, title, severity, status, assignee) VALUES
('INC-2024-0012', 'Phishing Email Campaign Detected', 'medium', 'resolved', 'Sarah Connor'),
('INC-2024-0011', 'Suspicious Network Traffic from External IP', 'high', 'investigating', 'John Matrix'),
('INC-2024-0010', 'Failed Authentication Attempts', 'low', 'resolved', 'Kyle Reese'),
('INC-2024-0009', 'Malware Signature Update Required', 'medium', 'in-progress', 'Sarah Connor');

INSERT INTO public.security_metrics (metric_name, metric_value, metric_change) VALUES
('System Security Score', 85.00, 2.00),
('Network Integrity', 92.00, 1.00),
('Threat Detection Rate', 97.00, 3.00),
('Response Time', 78.00, -5.00);

INSERT INTO public.monitored_assets (asset_name, asset_type, ip_address, hostname, operating_system) VALUES
('Web Server 01', 'Server', '10.0.1.10', 'web-01.company.com', 'Ubuntu 22.04'),
('Database Server', 'Database', '10.0.1.20', 'db-01.company.com', 'CentOS 8'),
('Workstation 007', 'Workstation', '192.168.1.100', 'ws-007.company.local', 'Windows 11'),
('Firewall', 'Network Device', '10.0.0.1', 'fw-01.company.com', 'pfSense'),
('Mail Server', 'Server', '10.0.1.30', 'mail-01.company.com', 'Ubuntu 20.04');