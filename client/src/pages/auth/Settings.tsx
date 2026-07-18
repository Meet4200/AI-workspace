import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Loader2, AlertTriangle, Trash2, Sun, Moon } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  
  // Theme settings
  const [darkMode, setDarkMode] = useState(user?.settings?.darkMode ?? true);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleTheme = async () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    try {
      await updateUserProfile({ darkMode: nextMode });
    } catch (err) {
      console.error('Failed to update theme preference', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setPassLoading(true);
    setPassMessage(null);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setPassMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.response?.data?.message || 'Incorrect current password' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== 'DELETE FOREVER') {
      setDeleteError('Please type the phrase exactly');
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete('/auth/delete-account');
      logout();
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading gradient-text">Account Settings</h1>
        <p className="text-muted-foreground text-sm">Configure security, preference modes, and account lifecycle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings categories */}
        <div className="md:col-span-1 space-y-3">
          <div className="p-4 rounded-xl glass border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Preferences</span>
            <button
              onClick={handleToggleTheme}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-sm transition-all text-left"
            >
              <span className="flex items-center gap-2">
                {darkMode ? <Moon size={16} className="text-purple-400" /> : <Sun size={16} className="text-amber-400" />}
                Theme Mode
              </span>
              <span className="text-xs text-muted-foreground uppercase">{darkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Change password & Security */}
        <div className="md:col-span-2 space-y-6">
          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl glass border border-white/5"
          >
            <h3 className="text-lg font-bold mb-4 font-heading flex items-center gap-2">
              <Key size={18} className="text-purple-400" /> Security Settings
            </h3>

            {passMessage && (
              <div
                className={`p-3 mb-6 rounded-lg text-sm text-center border ${
                  passMessage.type === 'success'
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                {passMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    New Password
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />} {showPass ? 'Hide Passwords' : 'Show Passwords'}
                </button>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/10 flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {passLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Danger Zone Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 space-y-4"
          >
            <h3 className="text-lg font-bold font-heading text-red-400 flex items-center gap-2">
              <AlertTriangle size={18} /> Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. All generated resumes, history, chats, and active subscription details will be deleted permanently.
            </p>
            <div className="flex justify-start">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-lg shadow-red-600/15 flex items-center gap-2 transition-all text-sm"
              >
                <Trash2 size={16} /> Delete Account Forever
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl glass border border-red-500/20 shadow-2xl space-y-4 text-left"
          >
            <h4 className="text-xl font-bold font-heading text-red-400 flex items-center gap-2">
              <AlertTriangle /> Are you absolutely sure?
            </h4>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. To confirm deletion, please type <strong className="text-foreground">DELETE FOREVER</strong> below.
            </p>

            {deleteError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE FOREVER"
                className="w-full px-4 py-2 bg-muted/50 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                required
              />
              <div className="flex justify-end gap-3 pt-2 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirm('');
                    setDeleteError(null);
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading || deleteConfirm !== 'DELETE FOREVER'}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? <Loader2 className="animate-spin" size={16} /> : 'Yes, Delete My Account'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
