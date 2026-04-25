'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Send } from 'lucide-react';

interface QuizCardProps {
  scenario: string;
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

/**
 * Interactive quiz component for open-ended answers.
 * Provides a scenario and evaluates the user's critical thinking.
 */
export const QuizCard: React.FC<QuizCardProps> = ({ scenario, onSubmit, isLoading }) => {
  const [answer, setAnswer] = useState('');
  const minChars = 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.length >= minChars && !isLoading) {
      onSubmit(answer);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4" aria-busy="true" role="status" aria-label="Evaluating your answer">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-24 w-full rounded-xl mb-4" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <article className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <Card className="border-t-4 border-t-primary shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Practical Scenario</span>
          </div>
          <CardTitle className="text-xl font-bold leading-snug">
            How would you handle this?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 p-5 rounded-xl text-lg italic leading-relaxed">
            &ldquo;{scenario}&rdquo;
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="quiz-answer" className="text-sm font-semibold text-muted-foreground">
                Your Answer (Explain your reasoning)
              </label>
              <Textarea
                id="quiz-answer"
                placeholder="Type your explanation here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[150px] text-base focus-visible:ring-primary resize-none"
              />
              <div className="flex justify-end">
                <span className={`text-xs ${answer.length < minChars ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {answer.length < minChars ? `Min ${minChars} characters required` : `${answer.length} characters`}
                </span>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            disabled={answer.length < minChars || isLoading}
            className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Submit for Evaluation
            <Send className="ml-2 w-4 h-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
};
