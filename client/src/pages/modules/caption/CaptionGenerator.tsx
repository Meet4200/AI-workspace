import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import { Sparkles, Loader2, Copy, CheckCircle, Instagram, Linkedin, Twitter } from 'lucide-react';

export const CaptionGenerator: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  const [imageUrl, setImageUrl] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch captions
  const { data: captions, isLoading } = useQuery({
    queryKey: ['captions'],
    queryFn: async () => {
      const res = await api.get('/captions');
      return res.data.captions;
    }
  });

  // Generate Caption Mutation
  const generateMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await api.post('/captions/generate', { imageUrl: url });
      return res.data.caption;
    },
    onSuccess: () => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['captions'] });
      setImageUrl('');
    }
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate(imageUrl || '/uploads/code.jpg');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading caption library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading gradient-text">AI Caption Generator</h1>
        <p className="text-muted-foreground text-sm">Upload images to generate professional captions optimized for LinkedIn, Twitter, and Instagram</p>
      </div>

      {user && user.credit && user.credit.balance < 2 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          Generating costs <strong>2 credits</strong>. You currently have <strong>{user.credit.balance} credits</strong>.
        </div>
      )}

      {/* Generator Trigger */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl glass border border-white/5 space-y-4 max-w-md text-left">
        <h3 className="font-bold text-sm">Image Reference Link</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Paste image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          <div className="border border-dashed border-white/10 p-5 rounded-xl text-center text-xs text-muted-foreground bg-muted/5">
            Click to upload images (Cloudinary link triggers)
          </div>

          <button
            type="submit"
            disabled={generateMutation.isPending}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
          >
            {generateMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            AI Generate Platform Captions (2 Credits)
          </button>
        </div>
      </form>

      {/* Renders platforms results */}
      <div className="space-y-6 pt-4 text-left">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recent Platform Outputs</h3>
        {captions?.map((cap: any) => (
          <div key={cap.id} className="p-5 rounded-2xl glass border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Instagram */}
            {cap.instaText && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-pink-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Instagram size={14} /> Instagram Text
                </span>
                <p className="text-slate-300 leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border h-36 overflow-y-auto">
                  {cap.instaText}
                </p>
                <button
                  onClick={() => handleCopy(cap.instaText)}
                  className="text-[10px] text-purple-400 hover:text-purple-200 font-semibold flex items-center gap-1"
                >
                  {copiedText === cap.instaText ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  Copy caption
                </button>
              </div>
            )}

            {/* LinkedIn */}
            {cap.linkedInText && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Linkedin size={14} /> LinkedIn Post
                </span>
                <p className="text-slate-300 leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border h-36 overflow-y-auto">
                  {cap.linkedInText}
                </p>
                <button
                  onClick={() => handleCopy(cap.linkedInText)}
                  className="text-[10px] text-purple-400 hover:text-purple-200 font-semibold flex items-center gap-1"
                >
                  {copiedText === cap.linkedInText ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  Copy caption
                </button>
              </div>
            )}

            {/* Twitter */}
            {cap.twitterText && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Twitter size={14} /> Twitter Draft
                </span>
                <p className="text-slate-300 leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border h-36 overflow-y-auto">
                  {cap.twitterText}
                </p>
                <button
                  onClick={() => handleCopy(cap.twitterText)}
                  className="text-[10px] text-purple-400 hover:text-purple-200 font-semibold flex items-center gap-1"
                >
                  {copiedText === cap.twitterText ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  Copy caption
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
