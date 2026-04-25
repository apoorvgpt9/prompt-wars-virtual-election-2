'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalystOutput } from '@/lib/validation';
import { Brain, Layers, Info } from 'lucide-react';

interface AnalysisCardProps {
  analysis?: AnalystOutput;
  isLoading: boolean;
}

/**
 * Component to display the AI's analysis of the selected topic.
 * Highlights key dimensions and complexity level.
 */
export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, isLoading }) => {
  if (isLoading && !analysis) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 space-y-4" aria-busy="true" role="status" aria-label="Analysing topic">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <article 
      className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500"
      aria-live="polite"
    >
      <Card className="border-l-4 border-l-primary shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle className="text-xl font-bold tracking-tight">
                AI Topic Analysis
              </CardTitle>
            </div>
            <Badge 
              variant={
                analysis.complexity === 'Beginner' ? 'secondary' :
                analysis.complexity === 'Intermediate' ? 'default' : 'destructive'
              }
              className="font-bold"
            >
              {analysis.complexity} Level
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase">
              <Info className="w-4 h-4" aria-hidden="true" />
              <span>Problem Area</span>
            </div>
            <p className="text-lg font-medium leading-relaxed">
              {analysis.problemArea}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Key Dimensions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.keyDimensions.map((dimension) => (
                <Badge key={dimension} variant="outline" className="bg-background px-3 py-1 border-primary/20">
                  {dimension}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t text-sm italic text-muted-foreground">
            Context: {analysis.userContext}
          </div>
        </CardContent>
      </Card>
    </article>
  );
};
