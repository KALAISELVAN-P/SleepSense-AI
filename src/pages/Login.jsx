import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    resetPassword(email);
    alert('Password reset link sent to your email');
    setShowForgot(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sleep Tracker</h2>
        {!showForgot ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <p>
              <button type="button" onClick={() => setShowForgot(true)}>
                Forgot Password?
              </button>
            </p>
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>
            <button type="button" onClick={() => setShowForgot(false)}>
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;