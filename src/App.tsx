import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisPage } from './pages/AnalysisPage';

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
            </Routes>
          </div>
        </Router>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;