import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import {
  ArrowLeft,
  Loader2,
  Save,
  Copy,
  FileDown,
  Sparkles,
  CheckCircle,
  FileText
} from 'lucide-react';

interface CoverLetterData {
  id: string;
  title: string;
  companyName: string;
  roleTitle: string;
  jobDescription: string;
  tone: string;
  length: string;
  content: string;
  updatedAt: string;
}

export const CoverLetterBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const [localLetter, setLocalLetter] = useState<CoverLetterData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch Cover Letter Data
  const { data: fetchedLetter, isLoading } = useQuery({
    queryKey: ['cover-letter', id],
    queryFn: async () => {
      const res = await api.get(`/covers/${id}`);
      return res.data.letter;
    },
    enabled: !!id
  });

  // Sync state
  useEffect(() => {
    if (fetchedLetter) {
      setLocalLetter({
        id: fetchedLetter.id,
        title: fetchedLetter.title,
        companyName: fetchedLetter.companyName,
        roleTitle: fetchedLetter.roleTitle,
        jobDescription: fetchedLetter.jobDescription,
        tone: fetchedLetter.tone,
        length: fetchedLetter.length,
        content: fetchedLetter.content,
        updatedAt: fetchedLetter.updatedAt
      });
    }
  }, [fetchedLetter]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<CoverLetterData>) => {
      const res = await api.put(`/covers/${id}`, data);
      return res.data.letter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letter', id] });
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      setIsSaving(false);
    }
  });

  // Autosave
  useEffect(() => {
    if (!localLetter) return;
    const delay = setTimeout(() => {
      setIsSaving(true);
      updateMutation.mutate(localLetter);
    }, 2000);
    return () => clearTimeout(delay);
  }, [localLetter]);

  const handleFieldChange = (field: keyof CoverLetterData, value: any) => {
    if (!localLetter) return;
    setLocalLetter({
      ...localLetter,
      [field]: value
    });
  };

  // AI REGENERATE
  const handleRegenerate = async () => {
    if (!localLetter) return;
    setAiLoading(true);
    try {
      const res = await api.post('/covers', {
        companyName: localLetter.companyName,
        roleTitle: localLetter.roleTitle,
        jobDescription: localLetter.jobDescription,
        tone: localLetter.tone,
        length: localLetter.length
      });
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      navigate(`/cover-letter/${res.data.letter.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopy = () => {
    if (!localLetter) return;
    navigator.clipboard.writeText(localLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (isLoading || !localLetter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading Cover Letter workstation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cover-letter')}
            className="p-2 border border-border hover:bg-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <input
              type="text"
              value={localLetter.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-purple-500 font-heading text-foreground"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                {isSaving ? (
                  <>
                    <Loader2 size={10} className="animate-spin" /> Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={10} className="text-emerald-400" /> Saved
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 border border-purple-500/20 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
          >
            {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Text'}
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/15"
          >
            <FileDown size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane form (5 cols) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="p-5 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="text-base font-bold font-heading">Letter Options</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block">Company Name</label>
                <input
                  type="text"
                  value={localLetter.companyName}
                  onChange={(e) => handleFieldChange('companyName', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block">Role Title</label>
                <input
                  type="text"
                  value={localLetter.roleTitle}
                  onChange={(e) => handleFieldChange('roleTitle', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block">Tone</label>
                <select
                  value={localLetter.tone}
                  onChange={(e) => handleFieldChange('tone', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="warm">Warm & Friendly</option>
                  <option value="bold">Bold & Confident</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block">Length</label>
                <select
                  value={localLetter.length}
                  onChange={(e) => handleFieldChange('length', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground block">Job Description</label>
              <textarea
                rows={5}
                value={localLetter.jobDescription}
                onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              />
            </div>

            <button
              onClick={handleRegenerate}
              disabled={aiLoading}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
            >
              {aiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              AI Re-generate (3 Credits)
            </button>
          </div>
        </div>

        {/* Right pane preview sheet (7 cols) */}
        <div className="lg:col-span-7 flex justify-center bg-muted/20 p-6 rounded-2xl border border-border/50 relative print:bg-white print:p-0 print:border-none">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/80 border border-border text-[10px] text-muted-foreground print:hidden">
            <FileText size={10} /> Letter Workstation Canvas
          </div>
          <div className="w-full max-w-[595px] print:w-full">
            <div className="bg-white text-slate-800 p-8 shadow-inner font-sans min-h-[700px] text-left flex flex-col justify-between rounded-lg print:shadow-none print:p-0">
              <textarea
                rows={25}
                value={localLetter.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                className="w-full h-full bg-transparent text-slate-800 text-xs leading-relaxed focus:outline-none resize-none"
              />
              <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-4 mt-6 print:hidden">
                Generated by IntelliDesk AI Workspace
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
