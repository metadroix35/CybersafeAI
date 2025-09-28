import { AlertTriangle, Shield, Wifi, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const threats = [
  {
    id: 1,
    type: "Intrusion Attempt",
    severity: "high",
    source: "192.168.1.105",
    time: "2 minutes ago",
    description: "Suspicious login attempts detected from external IP",
    icon: Shield,
  },
  {
    id: 2,
    type: "Malware Detection",
    severity: "critical",
    source: "workstation-007",
    time: "5 minutes ago",
    description: "Potential malware behavior identified in system processes",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "Network Anomaly",
    severity: "medium",
    source: "192.168.1.89",
    time: "12 minutes ago",
    description: "Unusual data transfer patterns detected",
    icon: Wifi,
  },
  {
    id: 4,
    type: "Data Breach Attempt",
    severity: "high",
    source: "database-server-01",
    time: "18 minutes ago",
    description: "Unauthorized access attempt to sensitive database",
    icon: Database,
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-cyber-danger/10 text-cyber-danger border-cyber-danger";
    case "high":
      return "bg-cyber-warning/10 text-cyber-warning border-cyber-warning";
    case "medium":
      return "bg-cyber-secondary/10 text-cyber-secondary border-cyber-secondary";
    default:
      return "bg-muted/10 text-muted-foreground border-muted";
  }
};

export const ThreatAlerts = () => {
  return (
    <Card className="bg-cyber-surface border-cyber-surface-variant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cyber-danger" />
          Real-time Threat Alerts
        </CardTitle>
        <CardDescription>
          Live monitoring of security threats and anomalies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {threats.map((threat) => {
              const Icon = threat.icon;
              return (
                <div
                  key={threat.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-cyber-surface-variant border border-border"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-cyber-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-cyber-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">
                        {threat.type}
                      </h4>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(threat.severity)}
                      >
                        {threat.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {threat.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Source: {threat.source}</span>
                      <span>{threat.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};