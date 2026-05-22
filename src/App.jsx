import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function StripeRedirect() {
  useEffect(() => {
    window.location.replace('https://buy.stripe.com/3cIdR2cZX514euXdA0bQY00');
  }, []);
  return null;
}
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/landing.html" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<StripeRedirect />} />
          <Route
            path="/onboarding"
            element={<ProtectedRoute><Onboarding /></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedLayout><Dashboard /></ProtectedLayout>}
          />
          <Route
            path="/leads"
            element={<ProtectedLayout><Leads /></ProtectedLayout>}
          />
          <Route
            path="/settings"
            element={<ProtectedLayout><Settings /></ProtectedLayout>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
