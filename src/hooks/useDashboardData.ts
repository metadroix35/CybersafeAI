import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      // Get active threats count
      const { count: threatsCount } = await supabase
        .from('threats')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get network events in last hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const { count: networkEventsCount } = await supabase
        .from('network_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', oneHourAgo.toISOString());

      // Get monitored assets count
      const { count: assetsCount } = await supabase
        .from('monitored_assets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online');

      // Get incidents count for this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const { count: incidentsCount } = await supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      return {
        activeThreats: threatsCount || 0,
        networkEvents: networkEventsCount || 0,
        monitoredAssets: assetsCount || 0,
        monthlyIncidents: incidentsCount || 0,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useThreats = () => {
  return useQuery({
    queryKey: ['threats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });
};

export const useIncidents = () => {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });
};

export const useSecurityMetrics = () => {
  return useQuery({
    queryKey: ['security-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_metrics')
        .select('*')
        .order('measurement_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};