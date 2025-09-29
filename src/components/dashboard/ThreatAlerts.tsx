import { AlertTriangle, Shield, Wifi, Database, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThreats } from "@/hooks/useDashboardData";
import { formatDistanceToNow } from "date-fns";

const getIconForThreatType = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('intrusion') || lowerType.includes('breach')) return Shield;
  if (lowerType.includes('malware') || lowerType.includes('virus')) return AlertTriangle;
  if (lowerType.includes('network') || lowerType.includes('traffic')) return Wifi;
  if (lowerType.includes('data') || lowerType.includes('database')) return Database;
  return AlertTriangle;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-cyber-danger/10 text-cyber-danger border-cyber-danger";
    case "high":
      return "bg-cyber-warning/10 text-cyber-warning border-cyber-warning";
    case "medium":
      return "bg-cyber-secondary/10 text-cyber-secondary border-cyber-secondary";
    case "low":
      return "bg-cyber-success/10 text-cyber-success border-cyber-success";
    default:
      return "bg-muted/10 text-muted-foreground border-muted";
  }
};

export const ThreatAlerts = () => {
  const { data: threats, isLoading, error } = useThreats();

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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                Error loading threats
              </div>
            ) : !threats || threats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active threats detected
              </div>
            ) : (
              threats.map((threat) => {
                const Icon = getIconForThreatType(threat.type);
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
                        <span>
                          Source: {String(threat.source_ip || threat.source_host || 'Unknown')}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(threat.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};