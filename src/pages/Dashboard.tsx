import { Shield, AlertTriangle, Activity, Eye, FileText, Users, Loader2, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreatAlerts } from "@/components/dashboard/ThreatAlerts";
import { SecurityMetrics } from "@/components/dashboard/SecurityMetrics";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { useDashboardMetrics } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the system.",
      });
      navigate('/auth');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-primary" />
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI-CyberShield Dashboard</h1>
            <p className="text-muted-foreground">Real-time cybersecurity monitoring and threat analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </div>
            <Badge variant="outline" className="bg-cyber-success/10 text-cyber-success border-cyber-success">
              <Shield className="w-3 h-3 mr-1" />
              System Protected
            </Badge>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-cyber-danger" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-cyber-danger">{metrics?.activeThreats || 0}</div>
                  <p className="text-xs text-muted-foreground">Active security threats</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
              <Activity className="h-4 w-4 text-cyber-secondary" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-cyber-secondary">{metrics?.networkEvents?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">Events in last hour</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitored Assets</CardTitle>
              <Eye className="h-4 w-4 text-cyber-success" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-cyber-success">{metrics?.monitoredAssets || 0}</div>
                  <p className="text-xs text-muted-foreground">Assets online</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Incidents</CardTitle>
              <FileText className="h-4 w-4 text-cyber-warning" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-cyber-warning">{metrics?.monthlyIncidents || 0}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatAlerts />
          <SecurityMetrics />
        </div>

        {/* Recent Incidents */}
        <RecentIncidents />
      </div>
    </div>
  );
};

export default Dashboard;