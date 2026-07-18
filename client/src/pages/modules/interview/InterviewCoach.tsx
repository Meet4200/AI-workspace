import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import { Sparkles, MessageSquare, Loader2, Award, CheckCircle, ChevronRight } from 'lucide-react';

export const InterviewCoach: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  const [roleTitle, setRoleTitle] = useState('Software Engineer');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAns, setCurrentAns] = useState('');

  const [finishedReview, setFinishedReview] = useState<any | null>(null);

  // Fetch interviews
  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const res = await api.get('/interviews');
      return res.data.interviews;
    }
  });

  // Generate Questions Mutation
  const questionsMutation = useMutation({
    mutationFn: async (titleText: string) => {
      const res = await api.post('/interviews/questions', { roleTitle: titleText });
      return res.data.questions;
    },
    onSuccess: (qs) => {
      setQuestions(qs);
      setCurrentIdx(0);
      setAnswers([]);
      setCurrentAns('');
      setFinishedReview(null);
    }
  });

  // Submit Interview Mutation
  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/interviews/submit', data);
      return res.data.interview;
    },
    onSuccess: (data) => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setFinishedReview(data);
      setQuestions([]);
    }
  });

  const handleStart = () => {
    if (!roleTitle) return;
    questionsMutation.mutate(roleTitle);
  };

  const handleNext = () => {
    const updatedAnswers = [...answers, currentAns];
    setAnswers(updatedAnswers);
    setCurrentAns('');

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Submit
      submitMutation.mutate({
        roleTitle,
        questions,
        answers: updatedAnswers
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading interview logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading gradient-text">Interview Coach</h1>
        <p className="text-muted-foreground text-sm">Practice standard technical & behavioral questions and get scored feedback from AI</p>
      </div>

      {user && user.credit && user.credit.balance < 5 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          Grading costs <strong>5 credits</strong>. You currently have <strong>{user.credit.balance} credits</strong>.
        </div>
      )}

      {/* Start Session / Setup */}
      {questions.length === 0 && !submitMutation.isPending && !finishedReview && (
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-4 max-w-md text-left">
          <h3 className="font-bold text-sm">Set Up Practice Session</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="e.g. React Developer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={handleStart}
              disabled={questionsMutation.isPending}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
            >
              {questionsMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              Start Practice Session
            </button>
          </div>
        </div>
      )}

      {/* Active Practice Session Questions card */}
      {questions.length > 0 && (
        <div className="p-6 rounded-2xl glass border border-purple-500/20 max-w-xl text-left space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-purple-400">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>AI Practice Coach</span>
          </div>

          <h3 className="font-bold text-base text-foreground leading-relaxed">
            {questions[currentIdx]}
          </h3>

          <textarea
            rows={5}
            placeholder="Type your response here..."
            value={currentAns}
            onChange={(e) => setCurrentAns(e.target.value)}
            className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
          />

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 ml-auto"
          >
            {currentIdx + 1 === questions.length ? 'Submit Practice (5 Credits)' : 'Next Question'} <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Submit Loading */}
      {submitMutation.isPending && (
        <div className="flex flex-col items-center justify-center p-8 border border-border bg-muted/5 rounded-2xl max-w-md">
          <Loader2 className="animate-spin text-purple-500" size={28} />
          <p className="text-xs text-muted-foreground mt-2">Evaluating answer details and calculating score...</p>
        </div>
      )}

      {/* Review Feedback panel */}
      {finishedReview && (
        <div className="p-6 rounded-2xl glass border border-emerald-500/20 max-w-2xl text-left space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Session Performance Review</h3>
              <p className="text-[10px] text-muted-foreground uppercase">Role: {finishedReview.position}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/10 p-3 rounded-lg border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Confidence Score</span>
              <span className="text-xl font-bold text-emerald-400">{finishedReview.confidenceScore}/100</span>
            </div>
            <div className="bg-muted/10 p-3 rounded-lg border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Communication</span>
              <span className="text-xl font-bold text-emerald-400">{finishedReview.communicationScore}/100</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wide block">Recommendations & Suggestions:</span>
            <ul className="space-y-1.5 pl-1 text-[11px] text-slate-300">
              {Array.isArray(finishedReview.suggestions) &&
                finishedReview.suggestions.map((sug: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1">
                    <CheckCircle size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{sug}</span>
                  </li>
                ))}
            </ul>
          </div>

          <button
            onClick={() => setFinishedReview(null)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg"
          >
            Start New Session
          </button>
        </div>
      )}

      {/* History log list */}
      <div className="space-y-3 pt-6 text-left">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Past Sessions History</h3>
        {interviews && interviews.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border bg-muted/5 text-center text-xs text-muted-foreground">
            No practice sessions recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interviews?.map((int: any) => (
              <div key={int.id} className="p-4 rounded-xl border border-white/5 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-300 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-foreground truncate max-w-[150px]">
                      {int.position}
                    </h4>
                    <span className="text-[9px] text-muted-foreground block">
                      Score: {int.confidenceScore} • {new Date(int.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
