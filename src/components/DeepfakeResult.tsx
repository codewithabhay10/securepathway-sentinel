
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, Download, Share2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DeepfakeResultProps {
  result: {
    isDeepfake: boolean | null;
    confidence: number;
    details: string;
  };
}

const DeepfakeResult: React.FC<DeepfakeResultProps> = ({ result }) => {
  // If result is still pending or null
  if (result.isDeepfake === null) {
    return null;
  }
  
  return (
    <Card className={cn(
      "border-l-4 animate-fade-in",
      result.isDeepfake 
        ? "border-l-red-500" 
        : "border-l-green-500"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {result.isDeepfake ? (
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            )}
            <div>
              <CardTitle>
                {result.isDeepfake 
                  ? "Likely Manipulated" 
                  : "Likely Authentic"}
              </CardTitle>
              <CardDescription>
                Our analysis is {result.confidence.toFixed(1)}% confident in this result
              </CardDescription>
            </div>
          </div>
          
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Save Result
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-1.5">
              <Info className="h-4 w-4 text-muted-foreground" />
              Analysis Details
            </h3>
            <p className="text-muted-foreground">{result.details}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence Score</span>
              <span className="font-medium">{result.confidence.toFixed(1)}%</span>
            </div>
            <Progress 
              value={result.confidence} 
              className={cn(
                "h-2",
                result.isDeepfake 
                  ? "bg-red-100 [&>div]:bg-red-500" 
                  : "bg-green-100 [&>div]:bg-green-500"
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Higher confidence indicates a more reliable result
            </p>
          </div>
          
          {result.isDeepfake && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <h4 className="text-red-800 font-medium flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-4 w-4" />
                Safety Notice
              </h4>
              <p className="text-sm text-red-700">
                This media appears to be manipulated. Be cautious about sharing or acting upon this content. Consider reporting it if it's being used to spread misinformation or harm others.
              </p>
            </div>
          )}
          
          <div className="flex md:hidden gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-1" />
              Save Result
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepfakeResult;
