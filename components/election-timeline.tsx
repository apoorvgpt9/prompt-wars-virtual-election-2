'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Milestone } from 'lucide-react';

interface TimelineItem {
  step: number;
  label: string;
  description: string;
  duration: string;
  isKeyMilestone: boolean;
}

interface ElectionTimelineProps {
  timeline: TimelineItem[];
}

/**
 * ElectionTimeline component renders the election process steps visually.
 * Uses circles and connecting lines to represent the flow.
 */
export const ElectionTimeline: React.FC<ElectionTimelineProps> = ({ timeline }) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Milestone className="w-5 h-5 text-primary" aria-hidden="true" />
          Process Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <div className="relative space-y-0">
          {/* Vertical line connecting the circles */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border z-0" aria-hidden="true" />
          
          {timeline.map((item, index) => (
            <div key={index} className="relative flex gap-6 pb-8 last:pb-0 group">
              {/* Circle Marker */}
              <div 
                className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${
                  item.isKeyMilestone 
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-110' 
                    : 'bg-background border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50'
                }`}
                aria-hidden="true"
              >
                {item.step}
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold tracking-tight ${item.isKeyMilestone ? 'text-primary text-base' : 'text-sm'}`}>
                    {item.label}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {item.duration}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
