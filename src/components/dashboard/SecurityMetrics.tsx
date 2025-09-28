import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const metrics = [
  {
    label: "System Security Score",
    value: 85,
    change: +2,
    color: "cyber-success",
  },
  {
    label: "Network Integrity",
    value: 92,
    change: +1,
    color: "cyber-secondary",
  },
  {
    label: "Threat Detection Rate",
    value: 97,
    change: +3,
    color: "cyber-primary",
  },
  {
    label: "Response Time",
    value: 78,
    change: -5,
    color: "cyber-warning",
  },
];

export const SecurityMetrics = () => {
  return (
    <Card className="bg-cyber-surface border-cyber-surface-variant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-secondary" />
          Security Metrics
        </CardTitle>
        <CardDescription>
          Key performance indicators for cybersecurity systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {metric.label}
              </span>
              <div className="flex items-center gap-1 text-xs">
                {metric.change > 0 ? (
                  <TrendingUp className="w-3 h-3 text-cyber-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-cyber-danger" />
                )}
                <span
                  className={
                    metric.change > 0 ? "text-cyber-success" : "text-cyber-danger"
                  }
                >
                  {metric.change > 0 ? "+" : ""}{metric.change}%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Progress value={metric.value} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-medium">{metric.value}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};