import { useState, useEffect, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Auth Pages
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import OTP from './pages/OTP';
import ForgotPassword from './pages/ForgotPassword';

// Onboarding Pages
import Onboarding from './pages/Onboarding';

// Future Page for the Pricing - To Do Later 
import Pricing from './pages/Pricing';

// Main App Pages
import Explore from './pages/Explore';

// Tools
import TextGenerator from './components/tools/TextGenerator';
import ScriptGenerator from './pages/ScriptGenerator';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// UI Context
import { UIProvider } from './context/UIContext';

// Loading Spinner
import Spinner from './components/common/Spinner';
import AiChat from './pages/AiChat';
import ImageGenerator from './pages/ImageGenerator';
import ThumbnailGenerator from './pages/ThumbnailGenerator';
import ContentGenerator from './pages/ContentGenerator';

// Protected Route Component with loading state handling
const ProtectedRoute = memo(({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
});

// Public Only Route (redirects to /chat if already authenticated)
const PublicOnlyRoute = memo(({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/chat" replace /> : children;
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <UIProvider>
          <Router>
            <Routes>
              {/* Auth Routes - Public Only (redirect to /chat if already logged in) */}
              <Route path="/signup" element={
                <PublicOnlyRoute>
                  <SignUp />
                </PublicOnlyRoute>
              } />
              <Route path="/login" element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp" element={<OTP />} /> {/* Keep OTP accessible from both states */}
              <Route path="/onboarding" element={
                <Onboarding />
              } />

              {/* Main App Routes - Protected */}
              <Route path="/explore" element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              } />

              {/* Tool Routes - Protected */}
              <Route path="/works/text-generator" element={
                <ProtectedRoute>
                  <TextGenerator />
                </ProtectedRoute>
              } />
              <Route path="/tools/script-writing" element={
                <ProtectedRoute>
                  <ScriptGenerator />
                </ProtectedRoute>
              } />
              <Route path="/tools/text-to-image" element={
                <ProtectedRoute>
                  <ImageGenerator />
                </ProtectedRoute>
              } />
              <Route path="/tools/thumbnail-creation" element={
                <ProtectedRoute>
                  <ThumbnailGenerator />
                </ProtectedRoute>
              } />
              <Route path="/tools/content-generator" element={
                <ProtectedRoute>
                  <ContentGenerator />
                </ProtectedRoute>
              } />

              {/* Pricing Page */}
              <Route path="/pricing" element={<Pricing />} />

              {/* Main App Routes - Protected */}
              <Route path="/chat" element={<AiChat />} />

              {/* Allow public landing at /chat but protect inner content */}
              <Route path="/" element={<Navigate to="/chat" />} />

              {/* Catch all other routes */}
              <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
          </Router>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
