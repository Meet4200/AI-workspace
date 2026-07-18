import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Mail,
  MessageSquareCode,
  Mic,
  UserCheck,
  Image as ImageIcon,
  CreditCard,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [darkMode, setDarkMode] = useState(user?.settings?.darkMode ?? true);

  const toggleTheme = async () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    try {
      await updateUserProfile({ darkMode: nextMode });
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Resume Builder', path: '/resume', icon: <FileText size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Cover Letter', path: '/cover-letter', icon: <FilePlus size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Email Writer', path: '/email-writer', icon: <Mail size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'AI PDF Chat', path: '/pdf-chat', icon: <MessageSquareCode size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Meeting Notes', path: '/meeting-notes', icon: <Mic size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Interview Coach', path: '/interview-coach', icon: <UserCheck size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Caption Gen', path: '/caption-gen', icon: <ImageIcon size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Billing & Plans', path: '/billing', icon: <CreditCard size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={18} />, roles: ['ADMIN', 'USER', 'GUEST'] },
  ];

  const adminItem = { name: 'Admin Panel', path: '/admin', icon: <ShieldAlert size={18} />, roles: ['ADMIN'] };

  const activeItem = navItems.find((item) => item.path === location.pathname) || (adminItem.path === location.pathname ? adminItem : null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Welcome to IntelliDesk', body: 'Start using our AI productivity suite today.', time: '2h ago' },
    { id: 2, title: 'Refreshed Credits', message: 'Your daily credits are now refreshed (+5 credits).', time: '1d ago' },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || 'USER'));
  const showAdminLink = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-all-300">
      {/* Sidebar: Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border sticky top-0 h-screen select-none z-20">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/20">
              ID
            </div>
            <span className="font-heading font-bold text-lg tracking-tight gradient-text">
              IntelliDesk AI
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/15 border-l-2 border-purple-500 text-purple-300'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          {showAdminLink && (
            <Link
              to={adminItem.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === adminItem.path
                  ? 'bg-red-500/15 border-l-2 border-red-500 text-red-300'
                  : 'text-muted-foreground hover:text-red-400 hover:bg-red-500/5'
              }`}
            >
              {adminItem.icon}
              {adminItem.name}
            </Link>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/20 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-sm font-semibold">
              {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-normal">{user?.name || 'User'}</p>
              <span className="text-[10px] text-muted-foreground leading-none flex items-center gap-1">
                <Sparkles size={8} className="text-purple-400" /> {user?.credit?.balance ?? 0} Credits
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer / Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col lg:hidden select-none"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    ID
                  </div>
                  <span className="font-heading font-bold text-lg gradient-text">
                    IntelliDesk AI
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-md border border-border"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {filteredNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-purple-600/15 border-l-2 border-purple-500 text-purple-300'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}

                {showAdminLink && (
                  <Link
                    to={adminItem.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === adminItem.path
                        ? 'bg-red-500/15 border-l-2 border-red-500 text-red-300'
                        : 'text-muted-foreground hover:text-red-400 hover:bg-red-500/5'
                    }`}
                  >
                    {adminItem.icon}
                    {adminItem.name}
                  </Link>
                )}
              </nav>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/20 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-sm font-semibold">
                    {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate leading-none">{user?.name || 'User'}</p>
                    <span className="text-[10px] text-muted-foreground leading-none flex items-center gap-1 mt-1">
                      <Sparkles size={8} className="text-purple-400" /> {user?.credit?.balance ?? 0} Credits
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-400 p-1"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground p-1 rounded-md border border-border"
            >
              <Menu size={18} />
            </button>

            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest hidden md:inline-block">
              {activeItem ? activeItem.name : 'Workspace'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-lg border border-border hover:bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Search"
            >
              <Search size={16} />
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-border hover:bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification Drawer */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-lg border border-border hover:bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative"
                title="Notifications"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500"></span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl glass border border-white/5 shadow-2xl p-4 z-30 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Notifications</span>
                        <span className="text-[10px] text-purple-400 font-semibold cursor-pointer">Mark all read</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-2.5 rounded-lg hover:bg-muted/20 border border-transparent hover:border-white/5 transition-all text-xs space-y-1">
                            <div className="flex justify-between font-semibold">
                              <span>{notif.title}</span>
                              <span className="text-[10px] text-muted-foreground font-normal">{notif.time}</span>
                            </div>
                            <p className="text-muted-foreground leading-normal">{notif.message || notif.body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Link to="/profile" className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-semibold hover:border hover:border-purple-500/30 transition-all">
                {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
              </Link>
            </div>
          </div>
        </header>

        {/* Search Modal */}
        <AnimatePresence>
          {searchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[15vh]">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-xl rounded-xl glass border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search size={18} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tools, resumes, chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 border border-border"
                  >
                    Esc
                  </button>
                </div>

                <div className="p-4 text-xs text-muted-foreground space-y-2">
                  <span className="font-semibold uppercase tracking-wider block">Quick Links</span>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredNavItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(item.path);
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 border border-transparent hover:border-white/5 transition-all text-left text-foreground font-medium"
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Pane */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
