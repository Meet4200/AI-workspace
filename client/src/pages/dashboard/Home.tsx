import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  FileText,
  FilePlus,
  Mail,
  Mic,
  MessageSquare,
  ChevronRight,
  FileUp,
  CreditCard,
  Plus,
  UserCheck
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Mock Data
  const recentActivities = [
    { id: 1, action: 'Generated Resume text', module: 'Resume Builder', time: '10m ago', icon: <FileText className="text-purple-400" size={14} /> },
    { id: 2, action: 'Drafted cold sales pitch', module: 'Email Writer', time: '1h ago', icon: <Mail className="text-pink-400" size={14} /> },
    { id: 3, action: 'Uploaded client contract.pdf', module: 'AI PDF Chat', time: 'Yesterday', icon: <FilePlus className="text-indigo-400" size={14} /> },
    { id: 4, action: 'Transcribed team meeting audio', module: 'Meeting Notes', time: '3 days ago', icon: <Mic className="text-emerald-400" size={14} /> }
  ];

  const recentChats = [
    { id: 1, title: 'Questions on PDF source context', time: '2h ago' },
    { id: 2, title: 'Email copy critique request', time: 'Yesterday' }
  ];

  const recentFiles = [
    { id: 1, name: 'Google_SWE_Resume.pdf', type: 'Resume', date: 'Jul 18, 2026' },
    { id: 2, name: 'Weekly_Sync_15Jul.mp3', type: 'Meeting', date: 'Jul 15, 2026' },
    { id: 3, name: 'Stripe_API_Specs.pdf', type: 'PDF Document', date: 'Jul 12, 2026' }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            Welcome back, <span className="gradient-text">{user?.name || 'Workspace Member'}</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Here is an overview of your AI Workspace and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Zap size={14} /> Role: {user?.role || 'USER'}
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Remaining Card */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl glass border border-white/5 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl"></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Credits Remaining</span>
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div>
              <span className="text-4xl font-bold font-heading">{user?.credit?.balance ?? 0}</span>
              <span className="text-muted-foreground text-xs ml-1.5">units</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(((user?.credit?.balance ?? 0) / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Daily Limit: {user?.credit?.dailyCredits ?? 0}</span>
                <span>Monthly Quota: {user?.credit?.monthlyCredits ?? 0}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleQuickAction('/billing')}
            className="w-full mt-6 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-medium rounded-lg text-xs flex items-center justify-center gap-1 transition-all border border-purple-500/10"
          >
            Buy Credits <Plus size={12} />
          </button>
        </motion.div>

        {/* Subscription Status Card */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl glass border border-white/5 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Active Plan</span>
              <CreditCard size={16} className="text-blue-400" />
            </div>
            <div>
              <span className="text-4xl font-bold font-heading capitalize">
                {user?.subscription?.plan.toLowerCase() || 'Free'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              Status: <span className="text-emerald-400 font-semibold uppercase">{user?.subscription?.status || 'active'}</span>
            </p>
          </div>
          <button
            onClick={() => handleQuickAction('/billing')}
            className="w-full mt-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium rounded-lg text-xs flex items-center justify-center gap-1 transition-all border border-blue-500/10"
          >
            Upgrade Plan <ChevronRight size={12} />
          </button>
        </motion.div>

        {/* Quick Stats / Usage */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl glass border border-white/5 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl"></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Usage Analytics</span>
              <TrendingUp size={16} className="text-indigo-400" />
            </div>
            <div>
              <span className="text-4xl font-bold font-heading">4</span>
              <span className="text-muted-foreground text-xs ml-1.5">modules used</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Most active module: <span className="text-indigo-300 font-semibold">Resume Builder</span>
            </p>
          </div>
          <button
            onClick={() => handleQuickAction('/settings')}
            className="w-full mt-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium rounded-lg text-xs flex items-center justify-center gap-1 transition-all border border-indigo-500/10"
          >
            View Settings <ArrowRight size={12} />
          </button>
        </motion.div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns (Quick Actions & Recent Files) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl glass border border-white/5 space-y-4"
          >
            <h3 className="text-lg font-bold font-heading flex items-center gap-2">
              <Zap size={18} className="text-purple-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickAction('/resume')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-muted/20 hover:bg-purple-600/10 hover:border-purple-500/20 hover:text-purple-300 transition-all gap-2 text-center"
              >
                <FileText size={20} />
                <span className="text-xs font-medium">Build Resume</span>
              </button>
              <button
                onClick={() => handleQuickAction('/cover-letter')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-muted/20 hover:bg-pink-600/10 hover:border-pink-500/20 hover:text-pink-300 transition-all gap-2 text-center"
              >
                <FilePlus size={20} />
                <span className="text-xs font-medium">Gen Cover Letter</span>
              </button>
              <button
                onClick={() => handleQuickAction('/email-writer')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-muted/20 hover:bg-sky-600/10 hover:border-sky-500/20 hover:text-sky-300 transition-all gap-2 text-center"
              >
                <Mail size={20} />
                <span className="text-xs font-medium">Write Email</span>
              </button>
              <button
                onClick={() => handleQuickAction('/pdf-chat')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-muted/20 hover:bg-indigo-600/10 hover:border-indigo-500/20 hover:text-indigo-300 transition-all gap-2 text-center"
              >
                <FileUp size={20} />
                <span className="text-xs font-medium">Upload PDF</span>
              </button>
              <button
                onClick={() => handleQuickAction('/meeting-notes')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-muted/20 hover:bg-emerald-600/10 hover:border-emerald-500/20 hover:text-emerald-300 transition-all gap-2 text-center"
              >
                <Mic size={20} />
                <span className="text-xs font-medium">Meeting Notes</span>
              </button>
              <button
                onClick={() => handleQuickAction('/interview-coach')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-muted/20 hover:bg-amber-600/10 hover:border-amber-500/20 hover:text-amber-300 transition-all gap-2 text-center"
              >
                <UserCheck size={20} />
                <span className="text-xs font-medium">Mock Interview</span>
              </button>
            </div>
          </motion.div>

          {/* Recent Files */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl glass border border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                <FileText size={18} className="text-blue-400" /> Recent Documents
              </h3>
            </div>
            <div className="divide-y divide-border">
              {recentFiles.map((file) => (
                <div key={file.id} className="py-3 flex items-center justify-between text-sm hover:bg-muted/10 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <span className="text-[10px] text-muted-foreground uppercase">{file.type}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{file.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Activity & AI Chats Feed) */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl glass border border-white/5 space-y-4"
          >
            <h3 className="text-lg font-bold font-heading flex items-center gap-2">
              <Clock size={18} className="text-amber-400" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs items-start">
                  <div className="mt-0.5 p-1.5 rounded bg-muted border border-border">
                    {act.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{act.action}</p>
                    <span className="text-[10px] text-muted-foreground">{act.module} • {act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent AI Chats */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl glass border border-white/5 space-y-4"
          >
            <h3 className="text-lg font-bold font-heading flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-400" /> Recent AI Chats
            </h3>
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigate('/pdf-chat')}
                  className="p-3 rounded-lg border border-white/5 bg-muted/10 hover:bg-muted/30 cursor-pointer flex justify-between items-center text-xs transition-all"
                >
                  <span className="font-medium truncate pr-4">{chat.title}</span>
                  <span className="text-muted-foreground whitespace-nowrap">{chat.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
