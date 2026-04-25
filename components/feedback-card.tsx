'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EvaluatorOutput } from '@/lib/validation';
import { CheckCircle, XCircle, RefreshCw, ArrowRightCircle } from 'lucide-react';

interface FeedbackCardProps {
  evaluation: EvaluatorOutput;
  onNext: () => void;
  onReset: () => void;
  isLastModule: boolean;
}

/**
 * Displays AI feedback on the user's quiz response.
 * Shows correctness, encouragement, and clear next steps.
 */
export const FeedbackCard: React.FC<FeedbackCardProps> = ({ evaluation, onNext, onReset, isLastModule }) => {
  return (
    <article className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <Card className={`border-l-8 ${evaluation.correct ? 'border-l-green-500' : 'border-l-amber-500'} shadow-2xl`}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {evaluation.correct ? (
                <CheckCircle className="w-8 h-8 text-green-500" aria-hidden="true" />
              ) : (
                <XCircle className="w-8 h-8 text-amber-500" aria-hidden="true" />
              )}
              <CardTitle className="text-2xl font-black">
                {evaluation.correct ? 'Excellent Insight!' : 'Room for Growth'}
              </CardTitle>
            </div>
            <Badge 
              className={`text-sm font-bold uppercase ${evaluation.correct ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
              variant="outline"
            >
              {evaluation.correct ? 'Correct' : 'Needs Review'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed font-medium">
              {evaluation.feedback}
            </p>
            <p className="text-muted-foreground italic bg-muted/30 p-4 rounded-lg">
              {evaluation.encouragement}
            </p>
          </div>

          <div className="pt-6 border-t space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Recommended Action</h3>
            <p className="text-sm font-bold flex items-center gap-2">
              <ArrowRightCircle className="w-4 h-4 text-primary" aria-hidden="true" />
              {evaluation.nextStep}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
          {!isLastModule && evaluation.correct ? (
            <Button onClick={onNext} className="w-full sm:flex-1 h-12 text-base font-bold shadow-md">
              Proceed to Next Module
            </Button>
          ) : (
            <Button onClick={onReset} variant="outline" className="w-full sm:flex-1 h-12 text-base font-bold">
              <RefreshCw className="mr-2 w-4 h-4" aria-hidden="true" />
              Learn Something Else
            </Button>
          )}
        </CardFooter>
      </Card>
    </article>
  );
};
