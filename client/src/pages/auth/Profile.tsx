import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Phone, Globe, MapPin, Loader2, Save, Sparkles } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [jobTitle, setJobTitle] = useState(user?.profile?.jobTitle || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [website, setWebsite] = useState(user?.profile?.website || '');
  const [location, setLocation] = useState(user?.profile?.location || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateUserProfile({
        name,
        bio,
        jobTitle,
        phone,
        website,
        location
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading gradient-text">My Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your personal details and public profile info</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Summary & Credits Card */}
        <div className="md:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl glass border border-white/5 space-y-6"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border border-white/10">
                {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{user?.name || 'Workspace Member'}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium capitalize">
                  {user?.role.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subscription Plan</span>
                <span className="font-semibold text-purple-400 capitalize">{user?.subscription?.plan.toLowerCase() || 'Free'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Credits Balance</span>
                <span className="font-semibold flex items-center gap-1 text-purple-300">
                  <Sparkles size={14} /> {user?.credit?.balance ?? 0}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl glass border border-white/5"
          >
            <h3 className="text-lg font-bold mb-4 font-heading">Personal Details</h3>

            {message && (
              <div
                className={`p-3 mb-6 rounded-lg text-sm text-center border ${
                  message.type === 'success'
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Email Address (Private)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/50">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2 bg-muted/10 rounded-lg border border-border/50 text-muted-foreground text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Job Title
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Briefcase size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Phone size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Website URL
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Globe size={16} />
                    </span>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Location
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <MapPin size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. London, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Bio Description
                </label>
                <textarea
                  placeholder="Tell us about yourself..."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 bg-muted/30 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/10 flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
