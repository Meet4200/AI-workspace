import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Calendar, Loader2, Sparkles, AlertCircle, Plus, X } from 'lucide-react';

export const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch emails
  const { data: emails, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const res = await api.get('/emails');
      return res.data.emails;
    }
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/emails', data);
      return res.data.email;
    },
    onSuccess: (newEmail) => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setIsOpenModal(false);
      // Reset
      setRecipient('');
      setPurpose('');
      setBodyInput('');
      navigate(`/email-writer/${newEmail.id}`);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to generate email');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/emails/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose || !bodyInput) {
      setErrorMsg('Purpose and context are required');
      return;
    }
    setErrorMsg(null);
    createMutation.mutate({
      recipient,
      purpose,
      bodyInput,
      tone
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this email draft?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading emails...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading gradient-text">AI Email Writer</h1>
          <p className="text-muted-foreground text-sm">Compose polished professional emails and quick replies with custom tones</p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/10 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] text-sm whitespace-nowrap"
        >
          <Plus size={16} /> Write Email
        </button>
      </div>

      {user && user.credit && user.credit.balance < 2 && (
        <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-400 text-xs flex gap-2.5 items-start max-w-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            Generating an email draft costs <strong>2 credits</strong>. You currently have <strong>{user.credit.balance} credits</strong>.
          </p>
        </div>
      )}

      {emails && emails.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-border rounded-2xl p-8 text-center bg-muted/5 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Mail size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No Email Drafts</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Click the button above to write your first email using AI.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {emails?.map((email: any) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/email-writer/${email.id}`)}
              className="p-5 rounded-2xl glass border border-white/5 shadow-lg hover:border-purple-500/30 cursor-pointer transition-all flex flex-col justify-between h-48 group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                    {email.tone}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base truncate group-hover:text-purple-300 transition-colors">
                    {email.subject}
                  </h3>
                  <span className="text-xs text-muted-foreground block truncate">
                    To: {email.recipient || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> {new Date(email.updatedAt).toLocaleDateString()}
                </span>

                <button
                  onClick={(e) => handleDelete(e, email.id)}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Draft"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl glass border border-white/10 shadow-2xl space-y-4 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-heading gradient-text">Compose Email Draft</h3>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-md border border-border"
                >
                  <X size={16} />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Recipient (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. manager@company.com"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email Subject / Purpose</label>
                    <input
                      type="text"
                      placeholder="e.g. requesting sick leave"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="complaint">Complaint</option>
                    <option value="followup">Follow Up</option>
                    <option value="thankyou">Thank You</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Context / Main Points</label>
                  <textarea
                    placeholder="Briefly state what you want to write..."
                    rows={4}
                    value={bodyInput}
                    onChange={(e) => setBodyInput(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Email (2 Credits)
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
