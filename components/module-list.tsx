'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BuilderOutput } from '@/lib/validation';
import { CheckCircle2, Circle, ArrowRight, GraduationCap, LayoutList, Milestone } from 'lucide-react';
import { StreamingText } from './streaming-text';
import { ElectionTimeline } from './election-timeline';

interface ModuleListProps {
  content: BuilderOutput;
  currentModuleIndex: number;
  onStartQuiz: () => void;
}

/**
 * Renders the sequence of learning modules.
 * Tracks progress and allows user to proceed through election topics.
 */
export const ModuleList: React.FC<ModuleListProps> = ({ content, currentModuleIndex, onStartQuiz }) => {
  const progress = ((currentModuleIndex + 1) / content.modules.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700" aria-live="polite">
      <header className="space-y-4 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-primary">
          {content.title}
        </h2>
        <div className="flex items-center justify-between text-sm text-muted-foreground max-w-sm mx-auto">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" aria-hidden="true" /> {content.estimatedTime} Total
          </span>
          <span className="font-bold">
            Module {currentModuleIndex + 1} of {content.modules.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 w-full max-w-sm mx-auto shadow-inner" aria-label={`Progress: ${Math.round(progress)}%`} />
        
        {content.timeline && content.timeline.length > 0 && (
          <div className="pt-8 border-t text-left max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-bold">Learning Path</h3>
            </div>
            <ElectionTimeline timeline={content.timeline} />
          </div>
        )}
      </header>

      <section className="grid gap-6">
        <div className="flex items-center gap-2 mb-2 px-1">
          <LayoutList className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Curriculum Modules</h3>
        </div>
        {content.modules.map((module, index) => {
          const isActive = index === currentModuleIndex;
          const isCompleted = index < currentModuleIndex;
          const isUpcoming = index > currentModuleIndex;

          return (
            <Card 
              key={module.id} 
              className={`transition-all duration-500 border-2 ${
                isActive ? 'border-primary shadow-xl scale-100' : 
                isCompleted ? 'border-muted opacity-60 scale-95 grayscale' :
                'border-dashed border-muted opacity-40 scale-90'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-xl font-bold flex items-center gap-2 ${isUpcoming ? 'text-muted-foreground' : ''}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" aria-hidden="true" />
                    ) : (
                      <Circle className={`w-6 h-6 ${isActive ? 'text-primary animate-pulse' : 'text-muted'}`} aria-hidden="true" />
                    )}
                    {module.title}
                    {isUpcoming && <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-0.5 rounded font-bold ml-2">Locked</span>}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`leading-relaxed ${isUpcoming ? 'text-muted-foreground/50 italic text-sm' : 'text-muted-foreground'}`}>
                  {isActive ? (
                    <StreamingText text={module.summary} speed={15} />
                  ) : isUpcoming ? (
                    "Content will be unlocked after completing previous modules."
                  ) : (
                    module.summary
                  )}
                </div>
                
                {isActive && (
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {module.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-primary font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              {isActive && (
                <CardFooter className="pt-2">
                  <Button 
                    onClick={onStartQuiz}
                    className="w-full group font-bold tracking-wide shadow-lg hover:shadow-primary/20"
                    size="lg"
                  >
                    {module.action}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </section>
    </div>
  );
};
