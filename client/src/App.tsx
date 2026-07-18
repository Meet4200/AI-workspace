import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 gradient-text font-heading">
                IntelliDesk AI
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mb-8">
                Your unified production-ready AI Workspace with Resume Builders, Cover Letters, PDF Chats, and more.
              </p>
              <div className="glass px-6 py-4 rounded-xl border border-white/10 shadow-lg text-sm text-purple-300">
                Phase 1 Foundation Setup Complete.
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
