import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      if (res.data.resetLinkForTesting) {
        setResetLink(res.data.resetLinkForTesting);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl glass shadow-2xl border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <h2 className="text-3xl font-bold tracking-tight font-heading gradient-text">
            Reset Password
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email and we'll send you a password reset link
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {message ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center"
          >
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
              {message}
            </div>
            {resetLink && (
              <div className="p-4 rounded-lg bg-amber-500/15 border border-amber-500/20 text-left space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide block">
                  Local Dev Reset Link:
                </span>
                <a
                  href={resetLink}
                  className="text-xs text-sky-400 hover:text-sky-300 hover:underline break-all block"
                >
                  {resetLink}
                </a>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Make sure to check your spam folder if you do not receive the email.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[0px] disabled:opacity-50 disabled:pointer-events-none text-sm mt-6"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
