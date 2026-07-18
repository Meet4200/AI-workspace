import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import { Play, Loader2, Sparkles, Trash2, Calendar, ClipboardCheck, Users } from 'lucide-react';

export const MeetingNotes: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch transcripts
  const { data: meetings, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const res = await api.get('/meetings');
      return res.data.meetings;
    }
  });

  // Create/Transcribe Mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/meetings', data);
      return res.data.meeting;
    },
    onSuccess: () => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      setTitle('');
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to process transcript');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meetings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    }
  });

  const handleTranscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createMutation.mutate({ title });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete these meeting notes?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading transcripts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading gradient-text">Meeting Notes</h1>
          <p className="text-muted-foreground text-sm">Upload meeting audio to transcribe, summarize, and extract action items using AI</p>
        </div>
      </div>

      {user && user.credit && user.credit.balance < 4 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          transcribing costs <strong>4 credits</strong>. You currently have <strong>{user.credit.balance} credits</strong>.
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Transcription trigger form */}
      <form onSubmit={handleTranscribe} className="p-5 rounded-2xl glass border border-white/5 space-y-4 max-w-xl text-left">
        <h3 className="font-bold text-sm">Record or Upload Audio</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="e.g. Project Alignment Call"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />

          <div className="border border-dashed border-white/10 p-5 rounded-xl text-center text-xs text-muted-foreground bg-muted/5">
            Click to upload meeting.wav or drop audio files
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || !title}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            AI Transcribe & Summarize (4 Credits)
          </button>
        </div>
      </form>

      {/* List transcripts */}
      <div className="grid grid-cols-1 gap-6">
        {meetings?.map((meet: any) => (
          <div key={meet.id} className="p-5 rounded-2xl glass border border-white/5 flex flex-col md:flex-row gap-6 relative group text-left">
            <button
              onClick={() => handleDelete(meet.id)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>

            {/* Left Col (Transcript Info & Transcript details) */}
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{meet.title}</h3>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar size={10} /> {new Date(meet.createdAt).toLocaleDateString()} • <Users size={10} /> Multi-Speaker
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1">
                  <Play size={10} /> Transcript Dialogue
                </span>
                <p className="text-[11px] text-slate-300 bg-muted/30 p-3 rounded-lg whitespace-pre-line leading-relaxed h-32 overflow-y-auto font-mono scrollbar-thin">
                  {meet.transcript}
                </p>
              </div>
            </div>

            {/* Right Col (AI Summary & Action items) */}
            <div className="flex-1 space-y-3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles size={10} /> AI Summary Minutes
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-muted/20 p-3 rounded-lg">
                  {meet.summary}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                  <ClipboardCheck size={10} /> Tasks & Action Items
                </span>
                <ul className="space-y-1 pl-1">
                  {Array.isArray(meet.actionItems) &&
                    (meet.actionItems as string[]).map((item, idx) => (
                      <li key={idx} className="text-[10px] text-slate-400 flex items-start gap-1">
                        <span>•</span> <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
