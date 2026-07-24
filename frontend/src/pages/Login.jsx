import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, User } from 'lucide-react';
import { authService } from '../services/api';
import smartEnergyLogo from '../assets/smartenergy-logo.svg';

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';
const LOCAL_USERS_KEY = 'smartEnergyUsers';

const defaultLocalUsers = [
  { id: 1, username: DEMO_USERNAME, email: 'admin@example.com', password: DEMO_PASSWORD, role: 'Admin', status: 'Active' },
  { id: 2, username: 'manager', email: 'manager@example.com', password: 'manager123', role: 'Manager', status: 'Active' },
  { id: 3, username: 'viewer', email: 'viewer@example.com', password: 'user123', role: 'User', status: 'Active' },
];

const getLocalUsers = () => {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY));
    if (Array.isArray(storedUsers) && storedUsers.length > 0) {
      const normalizedUsers = normalizeLocalUsers(storedUsers);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(normalizedUsers));
      return normalizedUsers;
    }
  } catch (error) {
    console.info('Unable to read local users.', error);
  }

  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaultLocalUsers));
  return defaultLocalUsers;
};

const normalizeLocalUsers = (users) => {
  return users.map((user) => {
    const defaultUser = defaultLocalUsers.find((item) => item.username === user.username);
    return {
      status: 'Active',
      ...user,
      password: user.password || defaultUser?.password || '',
      role: user.role || defaultUser?.role || 'User',
    };
  });
};

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

    const normalizedUsername = username.trim();

    try {
      const response = await authService.login({ username: normalizedUsername, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role || 'User');
      onLoginSuccess();
      navigate('/');
    } catch (err) {
      const localUser = getLocalUsers().find(
        (user) => user.username === normalizedUsername && user.password === password && user.status !== 'Inactive'
      );

      if (localUser) {
        localStorage.setItem('token', `local-token-${localUser.id}`);
        localStorage.setItem('username', localUser.username);
        localStorage.setItem('role', localUser.role);
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
            <img className="login-logo" src={smartEnergyLogo} alt="SmartEnergy logo" />
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
                  placeholder="Enter username"
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
                  placeholder="Enter password"
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
