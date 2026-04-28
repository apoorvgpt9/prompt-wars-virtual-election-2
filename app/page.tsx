'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ACTIVE_CONFIG } from '@/lib/domain-config';
import { AnalystOutput, BuilderOutput, EvaluatorOutput } from '@/lib/validation';
import { StructuredInput } from '@/components/structured-input';
import { AnalysisCard } from '@/components/analysis-card';
import { ModuleList } from '@/components/module-list';
import { QuizCard } from '@/components/quiz-card';
import { FeedbackCard } from '@/components/feedback-card';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { signOutUser } from '@/lib/firebase-client';
import { saveSession } from '@/lib/firestore';
import { User } from 'firebase/auth';

type Stage = 'idle' | 'analysing' | 'building' | 'learning' | 'evaluating' | 'feedback';

/**
 * Main application page for ElectEd.
 * Manages the structured workflow from topic selection to quiz evaluation.
 */
export default function Home() {
  const [stage, setStage] = useState<Stage>('idle');
  const [topic, setTopic] = useState('');
  const [analysis, setAnalysis] = useState<AnalystOutput>();
  const [content, setContent] = useState<BuilderOutput>();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluatorOutput>();
  const [error, setError] = useState<string | null>(null);
  const currentUserRef = useRef<User | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage !== 'idle' && stage !== 'analysing' && stage !== 'building') {
      mainRef.current?.focus();
    }
  }, [stage]);

  const handleTopicSubmit = async (selectedTopic: string) => {
    setTopic(selectedTopic);
    setStage('analysing');
    setError(null);

    try {
      // 1. Analyse Topic
      const analyseRes = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic }),
      });

      const analyseData = await analyseRes.json();
      if (!analyseRes.ok) throw new Error(analyseData.error || 'Failed to analyse topic');
      setAnalysis(analyseData.analysis);

      // 2. Build Content
      setStage('building');
      const buildRes = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: analyseData.analysis }),
      });

      const buildData = await buildRes.json();
      if (!buildRes.ok) throw new Error(buildData.error || 'Failed to build content');
      setContent(buildData.content);

      setStage('learning');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStage('idle');
    }
  };

  const handleQuizSubmit = async (answer: string) => {
    if (!content || !analysis) return;
    setStage('evaluating');
    setError(null);

    try {
      const evaluateRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer: answer,
          questionContext: content.modules[currentModuleIndex].quizScenario
        }),
      });

      const evaluateData = await evaluateRes.json();
      if (!evaluateRes.ok) throw new Error(evaluateData.error || 'Failed to evaluate answer');
      setEvaluation(evaluateData.evaluation);
      setStage('feedback');
      // Persist session to Firestore after successful evaluation
      if (currentUserRef.current) {
        saveSession(
          currentUserRef.current.uid,
          topic,
          evaluateData.evaluation.correct,
          evaluateData.evaluation.feedback
        ).catch(() => { /* session save is best-effort */ });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStage('learning');
    }
  };

  const handleNextModule = () => {
    if (content && currentModuleIndex < content.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setStage('learning');
    }
  };

  const handleReset = () => {
    setStage('idle');
    setTopic('');
    setAnalysis(undefined);
    setContent(undefined);
    setCurrentModuleIndex(0);
    setEvaluation(undefined);
  };

  return (
    <AuthGate>
      {(authedUser: User) => {
        // Keep ref in sync so event handlers outside the render-prop scope can access it
        currentUserRef.current = authedUser;
        return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:ring-4 focus:ring-offset-2 focus:ring-primary outline-none"
      >
        Skip to main content
      </a>

      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            className="flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary rounded-lg outline-none"
            onClick={handleReset}
            aria-label="Back to home"
          >
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">{ACTIVE_CONFIG.appName}</h1>
          </button>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block text-sm font-medium text-muted-foreground italic">
              {topic ? `Topic: ${topic}` : ACTIVE_CONFIG.tagline}
            </p>
            <button
              onClick={signOutUser}
              className="text-slate-400 hover:text-white text-sm transition-colors"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="container max-w-4xl mx-auto px-4 py-12 space-y-12 outline-none"
      >
        {error && (
          <div
            role="alert"
            className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {stage === 'idle' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Master the <span className="text-primary">Indian Election Process</span> with AI.
              </h2>
              <p className="text-lg text-muted-foreground">
                Enter a topic or select a suggestion below to begin your personalized learning journey.
              </p>
            </div>
            <StructuredInput onSubmit={handleTopicSubmit} isLoading={false} />
          </div>
        )}

        {(stage === 'analysing' || stage === 'building') && (
          <div className="space-y-12">
            <StructuredInput onSubmit={() => { }} isLoading={true} />
            <AnalysisCard isLoading={stage === 'building'} analysis={analysis} />
          </div>
        )}

        {stage === 'learning' && content && (
          <div className="space-y-12">
            <AnalysisCard isLoading={false} analysis={analysis} />
            <ModuleList
              content={content}
              currentModuleIndex={currentModuleIndex}
              onStartQuiz={() => setStage('evaluating')}
            />
          </div>
        )}

        {stage === 'evaluating' && content && (
          <QuizCard
            scenario={content.modules[currentModuleIndex].quizScenario}
            onSubmit={handleQuizSubmit}
            isLoading={false}
          />
        )}

        {stage === 'feedback' && evaluation && (
          <FeedbackCard
            evaluation={evaluation}
            onNext={handleNextModule}
            onReset={handleReset}
            isLastModule={content ? currentModuleIndex === content.modules.length - 1 : true}
          />
        )}
      </div>

      <footer className="py-12 border-t mt-24 bg-muted/20">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            © 2024 {ACTIVE_CONFIG.appName} — Educational Platform based on ECI Guidelines.
          </p>
        </div>
      </footer>
    </main>
      );
      }}
    </AuthGate>
  );
}
