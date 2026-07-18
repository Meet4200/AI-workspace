import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';

import {
  ArrowLeft,
  Loader2,
  Send,
  MessageSquare,
  FileText,
  Bookmark,
  Sparkles
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  createdAt: string;
}

interface ChatSession {
  id: string;
  title: string;
  document: {
    id: string;
    name: string;
    content: string;
  };
  messages: ChatMessage[];
}

export const PdfChatWorkspace: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [inputMsg, setInputMsg] = useState('');
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Fetch Chat Session
  const { data: chatData, isLoading } = useQuery<ChatSession>({
    queryKey: ['pdf-chat', id],
    queryFn: async () => {
      const res = await api.get(`/pdf/chats/${id}`);
      return res.data.chat;
    },
    enabled: !!id
  });

  // Scroll to bottom on messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData?.messages]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await api.post(`/pdf/chats/${id}`, { message });
      return res.data.reply;
    },
    onSuccess: () => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['pdf-chat', id] });
      setInputMsg('');
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || sendMutation.isPending) return;
    sendMutation.mutate(inputMsg.trim());
  };

  if (isLoading || !chatData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Initializing local RAG session...</p>
      </div>
    );
  }

  const paragraphs = chatData.document.content ? chatData.document.content.split(/\n+/).filter(Boolean) : [];

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pdf-chat')}
            className="p-2 border border-border hover:bg-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold font-heading text-foreground">
              {chatData.title.replace(/\[RAG:.*?\]\s*/, '')}
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Document: {chatData.document.name}
            </p>
          </div>
        </div>
      </div>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Side: Document Reader (5 Cols) */}
        <div className="lg:col-span-5 border border-border bg-muted/5 rounded-2xl flex flex-col overflow-hidden min-h-0">
          <div className="px-4 py-3 border-b border-border bg-muted/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
              <FileText size={14} /> Document Text
            </span>
            <span className="text-[10px] text-muted-foreground">{paragraphs.length} Paragraphs</span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-left leading-relaxed text-sm text-slate-300 scrollbar-thin">
            {paragraphs.map((p, idx) => {
              const isCited = activeHighlight === p;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveHighlight(isCited ? null : p)}
                  className={`p-3 rounded-xl transition-all cursor-pointer text-xs ${
                    isCited
                      ? 'bg-purple-600/20 border border-purple-500 text-purple-200'
                      : 'border border-transparent hover:bg-muted/30'
                  }`}
                >
                  <p>{p}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Chat thread (7 Cols) */}
        <div className="lg:col-span-7 border border-border rounded-2xl flex flex-col overflow-hidden min-h-0">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-muted/10 flex items-center gap-2">
            <MessageSquare size={14} className="text-purple-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">AI Conversation</span>
          </div>

          {/* Messages lists */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {chatData.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Ask anything about this document</h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    I will scan the paragraphs for keywords and summarize the results.
                  </p>
                </div>
              </div>
            )}

            {chatData.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 border text-xs leading-relaxed ${
                      isUser
                        ? 'bg-purple-600 border-purple-500 text-white rounded-tr-none'
                        : 'glass border-white/5 text-foreground rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Citations panel if present */}
                    {!isUser && msg.citations && (msg.citations as string[]).length > 0 && (
                      <div className="border-t border-white/5 pt-2.5 mt-2.5 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                          <Bookmark size={10} /> Reference Citations:
                        </span>
                        <div className="space-y-1.5">
                          {(msg.citations as string[]).map((cit, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => setActiveHighlight(cit)}
                              className="w-full text-left p-2 rounded bg-muted/40 hover:bg-muted/80 text-[10px] text-purple-300 font-medium truncate block border border-border/30"
                              title="Click to view and highlight in document"
                            >
                              "{cit}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Form sender */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-border bg-muted/10 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about the document... (1 credit)"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-2 bg-muted/40 rounded-xl border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              disabled={sendMutation.isPending}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || sendMutation.isPending}
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl disabled:opacity-50"
            >
              {sendMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
