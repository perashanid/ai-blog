import { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';

const AdminLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - in production, this should be more secure
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="admin-header">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="admin-login">
          <h1>Admin Access</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;