import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, User } from 'lucide-react';
import { authService } from '../services/api';

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.login({ username, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', response.data.username);
      onLoginSuccess();
      navigate('/');
    } catch (err) {
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('username', DEMO_USERNAME);
        onLoginSuccess();
        navigate('/');
        return;
      }

      setError(err.response?.data?.msg || 'Unable to sign in. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Smart Energy Management System</h2>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label className="login-field" htmlFor="username">
              <span>Username</span>
              <div>
                <User size={18} />
                <input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="login-field" htmlFor="password">
              <span>Password</span>
              <div>
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            {error && <p className="login-error">{error}</p>}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
