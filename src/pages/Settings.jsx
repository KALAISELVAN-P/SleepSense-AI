import { useState, useEffect } from 'react';
import { User, Lock, Wifi, Globe, Bell, Save, Edit } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, userProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    sleepGoal: '8 hours'
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        sleepGoal: userProfile.sleepGoal || '8 hours'
      });
    }
  }, [userProfile]);
  
  const [deviceId, setDeviceId] = useState('ESP32_001');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({
    sleepReminders: true,
    weeklyReports: true,
    apneaAlerts: true
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(profile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password changed successfully');
  };

  const handleDeviceConnect = () => {
    alert(`Connected to device: ${deviceId}`);
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-sections">
        <div className="settings-section">
          <div className="section-header">
            <User className="icon" />
            <h3>Profile Settings</h3>
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="btn-icon" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="profile-info">
            <div className="profile-summary">
              <div className="profile-avatar">
                <User className="avatar-icon" />
              </div>
              <div className="profile-details">
                <h4>{profile.name || 'User'}</h4>
                <p>{user?.email}</p>
                <span className="profile-badge">Active User</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({...prev, age: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="Age"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile(prev => ({...prev, gender: e.target.value}))}
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sleep Goal</label>
                <select
                  value={profile.sleepGoal}
                  onChange={(e) => setProfile(prev => ({...prev, sleepGoal: e.target.value}))}
                  disabled={!isEditing}
                >
                  <option value="6 hours">6 hours</option>
                  <option value="7 hours">7 hours</option>
                  <option value="8 hours">8 hours</option>
                  <option value="9 hours">9 hours</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile(prev => ({...prev, height: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="Height in cm"
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile(prev => ({...prev, weight: e.target.value}))}
                  disabled={!isEditing}
                  placeholder="Weight in kg"
                />
              </div>
            </div>
            
            {isEditing && (
              <button type="submit" className="save-btn">
                <Save className="btn-icon" />
                Save Changes
              </button>
            )}
          </form>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">{userProfile?.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString() : 'Never'}</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Lock className="icon" />
            <h3>Password & Security</h3>
          </div>
          <form onSubmit={handlePasswordChange} className="settings-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button type="submit">Change Password</button>
          </form>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Wifi className="icon" />
            <h3>Device Connection</h3>
          </div>
          <div className="device-settings">
            <div className="form-group">
              <label>ESP32 Device ID</label>
              <div className="device-input">
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter device ID"
                />
                <button onClick={handleDeviceConnect}>Connect</button>
              </div>
            </div>
            <div className="device-status">
              <span className="status-indicator connected"></span>
              <span>Device Connected</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Bell className="icon" />
            <h3>Notifications</h3>
          </div>
          <div className="notification-settings">
            <div className="notification-item">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.sleepReminders}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev, 
                    sleepReminders: e.target.checked
                  }))}
                />
                Sleep Reminders
              </label>
            </div>
            <div className="notification-item">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev, 
                    weeklyReports: e.target.checked
                  }))}
                />
                Weekly Reports
              </label>
            </div>
            <div className="notification-item">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.apneaAlerts}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev, 
                    apneaAlerts: e.target.checked
                  }))}
                />
                Apnea Alerts
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Globe className="icon" />
            <h3>Language & Appearance</h3>
          </div>
          <div className="appearance-settings">
            <div className="form-group">
              <label>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <div className="theme-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                />
                Dark Mode
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;