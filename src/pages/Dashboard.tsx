import { Shield, AlertTriangle, Activity, Eye, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreatAlerts } from "@/components/dashboard/ThreatAlerts";
import { SecurityMetrics } from "@/components/dashboard/SecurityMetrics";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";

const Dashboard = () => {
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
            <Badge variant="outline" className="bg-cyber-success/10 text-cyber-success border-cyber-success">
              <Shield className="w-3 h-3 mr-1" />
              System Protected
            </Badge>
            <Button>Generate Report</Button>
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
              <div className="text-2xl font-bold text-cyber-danger">23</div>
              <p className="text-xs text-muted-foreground">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
              <Activity className="h-4 w-4 text-cyber-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyber-secondary">1,247</div>
              <p className="text-xs text-muted-foreground">Events in last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitored Assets</CardTitle>
              <Eye className="h-4 w-4 text-cyber-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyber-success">89</div>
              <p className="text-xs text-muted-foreground">All systems online</p>
            </CardContent>
          </Card>

          <Card className="bg-cyber-surface border-cyber-surface-variant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-cyber-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyber-warning">156</div>
              <p className="text-xs text-muted-foreground">This month</p>
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