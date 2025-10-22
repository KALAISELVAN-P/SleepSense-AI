import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, Brain, TrendingUp, Activity, Target, FileText, 
  Music, AlarmClock, Calendar, BarChart3, Settings, HelpCircle, 
  LogOut, Moon, Sun, Gamepad2 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
    { path: '/graphs', icon: TrendingUp, label: 'Graphs' },
    { path: '/lifestyle', icon: Activity, label: 'Lifestyle' },
    { path: '/sleep-plan', icon: Target, label: 'Sleep Plan' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/sleep-sounds', icon: Music, label: 'Sleep Sounds' },
    { path: '/calendar', icon: Calendar, label: 'Calendar & Alarm' },
    { path: '/sleep-game', icon: Gamepad2, label: 'Sleep Game' },
    { path: '/ai-analytics', icon: BarChart3, label: 'AI Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/support', icon: HelpCircle, label: 'Support' }
  ];

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-header">
        <h2>Sleep Tracker</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="nav-items">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user.email.split('@')[0]}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;