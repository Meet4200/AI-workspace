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
import { ResumeList } from './pages/modules/resume/ResumeList.js';
import { ResumeBuilder } from './pages/modules/resume/ResumeBuilder.js';
import { CoverLetterList } from './pages/modules/cover/CoverLetterList.js';
import { CoverLetterBuilder } from './pages/modules/cover/CoverLetterBuilder.js';
import { EmailList } from './pages/modules/email/EmailList.js';
import { EmailBuilder } from './pages/modules/email/EmailBuilder.js';
import { PdfChatList } from './pages/modules/pdf/PdfChatList.js';
import { PdfChatWorkspace } from './pages/modules/pdf/PdfChatWorkspace.js';

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
                {/* Resume Builder Module */}
                <Route path="/resume" element={<ResumeList />} />
                <Route path="/resume/:id" element={<ResumeBuilder />} />
                {/* Cover Letter Module */}
                <Route path="/cover-letter" element={<CoverLetterList />} />
                <Route path="/cover-letter/:id" element={<CoverLetterBuilder />} />
                {/* Email Writer Module */}
                <Route path="/email-writer" element={<EmailList />} />
                <Route path="/email-writer/:id" element={<EmailBuilder />} />
                {/* PDF RAG Chat Module */}
                <Route path="/pdf-chat" element={<PdfChatList />} />
                <Route path="/pdf-chat/:id" element={<PdfChatWorkspace />} />
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
