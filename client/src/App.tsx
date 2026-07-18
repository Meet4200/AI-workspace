import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.js';
import { ProtectedRoute } from './middleware/ProtectedRoute.js';
import { AdminRoute } from './middleware/AdminRoute.js';
import { DashboardLayout } from './layouts/DashboardLayout.js';
import { Home } from './pages/dashboard/Home.js';
import { Login } from './pages/auth/Login.js';
import { Register } from './pages/auth/Register.js';
import { ForgotPassword } from './pages/auth/ForgotPassword.js';
import { ResetPassword } from './pages/auth/ResetPassword.js';
import { Profile } from './pages/auth/Profile.js';
import { Settings } from './pages/auth/Settings.js';
import { ModulePlaceholder } from './components/ModulePlaceholder.js';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Workspace Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Modules under construction */}
                <Route path="/resume" element={<ModulePlaceholder name="Resume Builder" phase="Phase 2" />} />
                <Route path="/cover-letter" element={<ModulePlaceholder name="Cover Letter Generator" phase="Phase 3" />} />
                <Route path="/email-writer" element={<ModulePlaceholder name="AI Email Writer" phase="Phase 4" />} />
                <Route path="/pdf-chat" element={<ModulePlaceholder name="AI PDF Chat" phase="Phase 5" />} />
                <Route path="/meeting-notes" element={<ModulePlaceholder name="AI Meeting Notes" phase="Phase 6" />} />
                <Route path="/interview-coach" element={<ModulePlaceholder name="AI Interview Coach" phase="Phase 7" />} />
                <Route path="/caption-gen" element={<ModulePlaceholder name="AI Image Caption Generator" phase="Phase 8" />} />
                <Route path="/billing" element={<ModulePlaceholder name="SaaS Subscription System" phase="Phase 9" />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin" element={<ModulePlaceholder name="Admin Dashboard" phase="Phase 10" />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
