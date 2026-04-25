'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ACTIVE_CONFIG } from '@/lib/domain-config';

interface StructuredInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

/**
 * Component for user to select or type an election topic.
 * Features topic chips, character counter, and keyboard submission.
 */
export const StructuredInput: React.FC<StructuredInputProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const maxLength = 200;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 w-full max-w-2xl mx-auto p-6" aria-busy="true" role="status" aria-label="Analysing topic">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 w-full max-w-2xl mx-auto p-6 bg-card rounded-xl border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="topic-input" 
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {ACTIVE_CONFIG.inputLabel}
          </label>
          <div className="relative">
            <Input
              id="topic-input"
              placeholder={ACTIVE_CONFIG.inputPlaceholder}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={maxLength}
              aria-describedby="char-count"
              className="pr-16 h-12 text-lg focus-visible:ring-primary"
            />
            <span 
              id="char-count" 
              aria-live="polite"
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${
                topic.length >= maxLength ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              {topic.length}/{maxLength}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Suggested topics">
          {ACTIVE_CONFIG.topics.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              role="button"
              tabIndex={0}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary outline-none"
              onClick={() => {
                setTopic(t);
                onSubmit(t);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setTopic(t);
                  onSubmit(t);
                }
              }}
            >
              {t}
            </Badge>
          ))}
        </div>

        <Button 
          type="submit" 
          disabled={!topic.trim() || isLoading}
          className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
        >
          Analyse Topic
        </Button>
      </form>
    </section>
  );
};
