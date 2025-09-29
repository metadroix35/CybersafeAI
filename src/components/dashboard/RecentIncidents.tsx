import { Clock, CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIncidents } from "@/hooks/useDashboardData";
import { formatDistanceToNow, format } from "date-fns";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "resolved":
      return <CheckCircle className="w-4 h-4 text-cyber-success" />;
    case "investigating":
      return <AlertCircle className="w-4 h-4 text-cyber-warning" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-cyber-secondary" />;
    default:
      return <XCircle className="w-4 h-4 text-cyber-danger" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-cyber-success/10 text-cyber-success border-cyber-success";
    case "investigating":
      return "bg-cyber-warning/10 text-cyber-warning border-cyber-warning";
    case "in-progress":
      return "bg-cyber-secondary/10 text-cyber-secondary border-cyber-secondary";
    default:
      return "bg-cyber-danger/10 text-cyber-danger border-cyber-danger";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-cyber-danger/10 text-cyber-danger border-cyber-danger";
    case "medium":
      return "bg-cyber-warning/10 text-cyber-warning border-cyber-warning";
    case "low":
      return "bg-cyber-success/10 text-cyber-success border-cyber-success";
    default:
      return "bg-muted/10 text-muted-foreground border-muted";
  }
};

export const RecentIncidents = () => {
  const { data: incidents, isLoading, error } = useIncidents();

  return (
    <Card className="bg-cyber-surface border-cyber-surface-variant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyber-primary" />
              Recent Security Incidents
            </CardTitle>
            <CardDescription>
              Latest security incidents and their resolution status
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All Incidents
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Error loading incidents
            </div>
          ) : !incidents || incidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent incidents found
            </div>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-4 rounded-lg bg-cyber-surface-variant border border-border"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(incident.status)}
                    <span className="text-xs font-mono text-muted-foreground">
                      {incident.incident_id}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {incident.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {incident.assignee && `Assigned to ${incident.assignee} • `}
                      Created {format(new Date(incident.created_at), "MMM dd, HH:mm")}
                      {incident.resolved_at && 
                        ` • Resolved ${format(new Date(incident.resolved_at), "MMM dd, HH:mm")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getSeverityColor(incident.severity)}
                  >
                    {incident.severity.toUpperCase()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStatusColor(incident.status)}
                  >
                    {incident.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};