import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import VoiceAssistant from './VoiceAssistant';
import { 
  Settings, 
  LogOut, 
  User, 
  Moon, 
  Sun, 
  Bell, 
  Search,
  ChevronDown
} from 'lucide-react';

const TopBar = () => {
  const { user, userProfile, logout } = useAuth();
  const { sleepData } = useData();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, message: '🎉 Your sleep quality improved by 15%', time: '2 hours ago', type: 'success', emoji: '🎉' },
    { id: 2, message: '⚠️ Sleep apnea detected last night', time: '5 hours ago', type: 'warning', emoji: '⚠️' },
    { id: 3, message: '📊 Weekly report is ready', time: '1 day ago', type: 'info', emoji: '📊' }
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const query = searchQuery.toLowerCase();
      if (query.includes('report') || query.includes('analytics')) {
        navigate('/reports');
      } else if (query.includes('insight') || query.includes('ai') || query.includes('analysis')) {
        navigate('/ai-insights');
      } else if (query.includes('graph') || query.includes('chart')) {
        navigate('/graphs');
      } else if (query.includes('calendar') || query.includes('alarm')) {
        navigate('/calendar');
      } else if (query.includes('sound') || query.includes('music')) {
        navigate('/sleep-sounds');
      } else if (query.includes('setting') || query.includes('profile')) {
        navigate('/settings');
      } else if (query.includes('lifestyle') || query.includes('habit')) {
        navigate('/lifestyle');
      } else if (query.includes('plan') || query.includes('goal')) {
        navigate('/sleep-plan');
      } else {
        navigate('/dashboard');
      }
      setSearchQuery('');
    }
  };

  if (!user) return null;

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search sleep data, reports..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>
      </div>

      <div className="top-bar-right">
        {/* Voice Assistant */}
        <VoiceAssistant />
        
        {/* Theme Toggle */}
        <button className="top-bar-btn theme-btn" onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <div className="notification-container">
          <button 
            className="top-bar-btn notification-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            🔔
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>🔔 Pooja Notification Center</h4>
                <span className="notification-count">{notifications.length} new</span>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <div className="notification-icon">
                      {notification.emoji}
                    </div>
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="view-all-btn" onClick={() => { navigate('/dashboard'); setShowNotifications(false); }}>View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-container">
          <button 
            className="user-menu-btn" 
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar-small">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-info-small">
              <span className="user-name-small">{userProfile?.name || user.email.split('@')[0]}</span>
              <span className="user-role">Age: {userProfile?.age || 'Not set'} yrs • Score: {sleepData.currentMetrics?.quality || 0}%</span>
            </div>
            <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="user-details-dropdown">
                  <h4>{user.email.split('@')[0]}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              
              <div className="user-dropdown-menu">
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                  <span className="dropdown-emoji">👤</span>
                  <span>Profile</span>
                </button>
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                  <span className="dropdown-emoji">⚙️</span>
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-emoji">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;