import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Threat {
  id: string;
  type: string;
  description: string;
  severity: string;
  source_ip?: string;
  source_host?: string;
  raw_data?: any;
}

interface AIThreatAnalysisProps {
  threat: Threat;
}

export const AIThreatAnalysis = ({ threat }: AIThreatAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const { toast } = useToast();

  const analyzeThreat = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-threat', {
        body: { threatData: threat }
      });

      if (error) throw error;

      if (data.success) {
        setAnalysis(data.analysis);
        toast({
          title: "AI Analysis Complete",
          description: "Threat has been analyzed successfully.",
        });
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error('Error analyzing threat:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze threat",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-cyber-surface border-cyber-surface-variant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyber-primary" />
          AI Threat Analysis
        </CardTitle>
        <CardDescription>
          Get AI-powered insights and recommendations for this threat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-cyber-warning" />
          <span className="text-sm font-medium">{threat.type}</span>
        </div>
        
        <div className="p-3 bg-cyber-surface-variant rounded-lg">
          <p className="text-sm text-muted-foreground">{threat.description}</p>
        </div>

        <Button 
          onClick={analyzeThreat} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Threat...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>

        {analysis && (
          <div className="mt-4 p-4 bg-cyber-surface-variant rounded-lg border border-cyber-primary/20">
            <h4 className="text-sm font-semibold mb-2 text-cyber-primary">AI Analysis Results</h4>
            <div className="text-sm text-foreground whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};