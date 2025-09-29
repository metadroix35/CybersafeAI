import { Activity, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSecurityMetrics } from "@/hooks/useDashboardData";

export const SecurityMetrics = () => {
  const { data: metrics, isLoading, error } = useSecurityMetrics();

  // Group metrics by name and calculate averages and changes
  const processedMetrics = metrics ? 
    Object.entries(
      metrics.reduce((acc, metric) => {
        if (!acc[metric.metric_name]) {
          acc[metric.metric_name] = [];
        }
        acc[metric.metric_name].push(metric);
        return acc;
      }, {} as Record<string, typeof metrics>)
    ).map(([name, values]) => {
      const sortedValues = values.sort((a, b) => 
        new Date(b.measurement_time).getTime() - new Date(a.measurement_time).getTime()
      );
      
      const current = Number(sortedValues[0]?.metric_value || 0);
      const previous = Number(sortedValues[1]?.metric_value || current);
      const change = Number(sortedValues[0]?.metric_change || (current - previous));
      
      return {
        label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: Math.round(current),
        change: Math.round(change),
      };
    }).slice(0, 4) : [];

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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            Error loading metrics
          </div>
        ) : processedMetrics.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No metrics data available
          </div>
        ) : (
          processedMetrics.map((metric, index) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
};