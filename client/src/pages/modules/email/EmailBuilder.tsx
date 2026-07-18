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
  Sparkles,
  CheckCircle,
  Mail,
  Languages,
  Wand2
} from 'lucide-react';

interface EmailData {
  id: string;
  subject: string;
  body: string;
  recipient: string;
  purpose: string;
  tone: string;
  updatedAt: string;
}

export const EmailBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const [localEmail, setLocalEmail] = useState<EmailData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('Spanish');

  // Fetch Email Data
  const { data: fetchedEmail, isLoading } = useQuery({
    queryKey: ['email-draft', id],
    queryFn: async () => {
      const res = await api.get(`/emails/${id}`);
      return res.data.email;
    },
    enabled: !!id
  });

  // Sync state
  useEffect(() => {
    if (fetchedEmail) {
      setLocalEmail({
        id: fetchedEmail.id,
        subject: fetchedEmail.subject,
        body: fetchedEmail.body,
        recipient: fetchedEmail.recipient || '',
        purpose: fetchedEmail.purpose,
        tone: fetchedEmail.tone,
        updatedAt: fetchedEmail.updatedAt
      });
    }
  }, [fetchedEmail]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<EmailData>) => {
      const res = await api.put(`/emails/${id}`, data);
      return res.data.email;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-draft', id] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setIsSaving(false);
    }
  });

  // Autosave
  useEffect(() => {
    if (!localEmail) return;
    const delay = setTimeout(() => {
      setIsSaving(true);
      updateMutation.mutate(localEmail);
    }, 2000);
    return () => clearTimeout(delay);
  }, [localEmail]);

  const handleFieldChange = (field: keyof EmailData, value: any) => {
    if (!localEmail) return;
    setLocalEmail({
      ...localEmail,
      [field]: value
    });
  };

  // AI REGENERATE
  const handleRegenerate = async () => {
    if (!localEmail) return;
    setAiLoading('regen');
    try {
      const res = await api.post('/emails', {
        recipient: localEmail.recipient,
        purpose: localEmail.purpose,
        bodyInput: localEmail.body,
        tone: localEmail.tone
      });
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      navigate(`/email-writer/${res.data.email.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  // AI IMPROVE TONE / GRAMMAR
  const handleImprove = async () => {
    if (!localEmail) return;
    setAiLoading('improve');
    try {
      const res = await api.post('/emails/ai/improve', {
        text: localEmail.body,
        tone: localEmail.tone
      });
      handleFieldChange('body', res.data.improved);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  // AI TRANSLATE
  const handleTranslate = async () => {
    if (!localEmail) return;
    setAiLoading('translate');
    try {
      const res = await api.post('/emails/ai/translate', {
        text: localEmail.body,
        language: targetLang
      });
      handleFieldChange('body', res.data.translated);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  const handleCopy = () => {
    if (!localEmail) return;
    navigator.clipboard.writeText(localEmail.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !localEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading Email Writer workstation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/email-writer')}
            className="p-2 border border-border hover:bg-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <input
              type="text"
              value={localEmail.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
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
            {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Email Body'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane form (5 cols) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="p-5 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="text-base font-bold font-heading">Draft Options</h3>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground block">Recipient</label>
              <input
                type="text"
                value={localEmail.recipient}
                onChange={(e) => handleFieldChange('recipient', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block">Tone</label>
                <select
                  value={localEmail.tone}
                  onChange={(e) => handleFieldChange('tone', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="complaint">Complaint</option>
                  <option value="followup">Follow Up</option>
                  <option value="thankyou">Thank You</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block">Purpose</label>
                <input
                  type="text"
                  value={localEmail.purpose}
                  onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleRegenerate}
              disabled={aiLoading === 'regen'}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all shadow-lg shadow-purple-600/10"
            >
              {aiLoading === 'regen' ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              AI Re-generate Draft (2 Credits)
            </button>
          </div>

          {/* Smart AI Toolbar */}
          <div className="p-5 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="text-base font-bold font-heading">AI Writing Helpers</h3>

            <div className="space-y-3">
              <button
                onClick={handleImprove}
                disabled={aiLoading === 'improve'}
                className="w-full py-2 border border-purple-500/20 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                {aiLoading === 'improve' ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                Polish Grammar & Tone
              </button>

              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground block">Translate Draft</label>
                <div className="flex gap-2">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="flex-1 px-2 py-1 bg-muted/45 rounded-lg border border-border text-foreground text-xs focus:outline-none"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                  <button
                    onClick={handleTranslate}
                    disabled={aiLoading === 'translate'}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    {aiLoading === 'translate' ? <Loader2 className="animate-spin" size={12} /> : <Languages size={12} />}
                    Translate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane preview sheet (7 cols) */}
        <div className="lg:col-span-7 flex justify-center bg-muted/20 p-6 rounded-2xl border border-border/50 relative">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/80 border border-border text-[10px] text-muted-foreground">
            <Mail size={10} /> Compose Canvas
          </div>
          <div className="w-full max-w-[595px]">
            <div className="bg-white text-slate-800 p-8 shadow-inner font-sans min-h-[500px] text-left flex flex-col justify-between rounded-lg">
              <div className="space-y-4">
                {/* Header details */}
                <div className="border-b border-slate-100 pb-3 text-xs text-slate-500 font-medium space-y-1.5">
                  <div><span className="text-slate-400">To:</span> {localEmail.recipient || '<no recipient specified>'}</div>
                  <div><span className="text-slate-400">Subject:</span> {localEmail.subject}</div>
                </div>

                <textarea
                  rows={20}
                  value={localEmail.body}
                  onChange={(e) => handleFieldChange('body', e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-xs leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-4 mt-6">
                Generated by IntelliDesk AI Workspace
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
