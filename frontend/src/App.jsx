import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Layout from './components/Layout';
import ModulePage from './pages/ModulePage';
import AIInsights from './pages/AIInsights';
import UsersPage from './pages/UsersPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/" element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="buildings" element={<ModulePage type="buildings" />} />
          <Route path="departments" element={<ModulePage type="departments" />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="energy" element={<ModulePage type="energy" />} />
          <Route path="ai" element={<AIInsights />} />
          <Route path="reports" element={<ModulePage type="reports" />} />
          <Route path="settings" element={<ModulePage type="settings" />} />
        </Route>
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
