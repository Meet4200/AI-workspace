import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { useAuth } from '../../../context/AuthContext.js';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Calendar, FileCheck, Loader2, AlertCircle } from 'lucide-react';

export const ResumeList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Resumes
  const { data: resumesData, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await api.get('/resumes');
      return res.data.resumes;
    }
  });

  // Create Resume Mutation
  const createResumeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/resumes');
      return res.data.resume;
    },
    onSuccess: (newResume) => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      navigate(`/resume/${newResume.id}`);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create resume');
    }
  });

  // Delete Resume Mutation
  const deleteResumeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    }
  });

  const handleCreate = () => {
    setErrorMsg(null);
    createResumeMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResumeMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading gradient-text">Resume Builder</h1>
          <p className="text-muted-foreground text-sm">Create and optimize ATS-compliant resumes with AI suggestions</p>
        </div>

        <button
          onClick={handleCreate}
          disabled={createResumeMutation.isPending}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/10 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {createResumeMutation.isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Plus size={16} /> Create Resume
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 max-w-md">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Credit balance warning if low */}
      {user && user.credit && user.credit.balance < 5 && (
        <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-400 text-xs flex gap-2.5 items-start max-w-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            Creating a resume costs <strong>5 credits</strong>. You currently have <strong>{user.credit.balance} credits</strong>. Please purchase more credits or wait for your daily refresh to proceed.
          </p>
        </div>
      )}

      {resumesData && resumesData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-border rounded-2xl p-8 text-center bg-muted/5 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileText size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No Resumes Found</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Click the button above to create your first ATS-optimized professional resume.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resumesData?.map((resume: any) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/resume/${resume.id}`)}
              className="p-5 rounded-2xl glass border border-white/5 shadow-lg hover:border-purple-500/30 cursor-pointer transition-all flex flex-col justify-between h-48 group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    <FileCheck size={10} /> ATS Score: {resume.atsScore}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base truncate group-hover:text-purple-300 transition-colors">
                    {resume.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Template: {resume.templateId}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> {new Date(resume.updatedAt).toLocaleDateString()}
                </span>

                <button
                  onClick={(e) => handleDelete(e, resume.id)}
                  disabled={deleteResumeMutation.isPending}
                  className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Resume"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
