// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';

function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute adminOnly>
          <Admin />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}