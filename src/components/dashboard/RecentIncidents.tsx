import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const incidents = [
  {
    id: "INC-2024-0012",
    title: "Phishing Email Campaign Detected",
    status: "resolved",
    severity: "medium",
    assignee: "Sarah Connor",
    created: "2024-01-15 14:30",
    resolved: "2024-01-15 16:45",
  },
  {
    id: "INC-2024-0011",
    title: "Suspicious Network Traffic from External IP",
    status: "investigating",
    severity: "high",
    assignee: "John Matrix",
    created: "2024-01-15 12:15",
    resolved: null,
  },
  {
    id: "INC-2024-0010",
    title: "Failed Authentication Attempts",
    status: "resolved",
    severity: "low",
    assignee: "Kyle Reese",
    created: "2024-01-15 09:20",
    resolved: "2024-01-15 10:30",
  },
  {
    id: "INC-2024-0009",
    title: "Malware Signature Update Required",
    status: "in-progress",
    severity: "medium",
    assignee: "Sarah Connor",
    created: "2024-01-14 16:45",
    resolved: null,
  },
];

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
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-center justify-between p-4 rounded-lg bg-cyber-surface-variant border border-border"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(incident.status)}
                  <span className="text-xs font-mono text-muted-foreground">
                    {incident.id}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    {incident.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Assigned to {incident.assignee} • Created {incident.created}
                    {incident.resolved && ` • Resolved ${incident.resolved}`}
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
                  {incident.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};