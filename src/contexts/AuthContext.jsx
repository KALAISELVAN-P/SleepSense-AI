import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedProfile = localStorage.getItem('userProfile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Check if user exists
    const existingProfile = localStorage.getItem(`profile_${email}`);
    if (!existingProfile) {
      alert('Account not found. Please sign up first.');
      return false;
    }
    
    const userData = { email, role: 'user', id: Date.now() };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Load existing profile for this user
    const profile = JSON.parse(existingProfile);
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    return true;
  };

  const signup = (email, password, profileData = {}) => {
    // Check if user already exists
    const existingProfile = localStorage.getItem(`profile_${email}`);
    if (existingProfile) {
      alert('Account already exists. Please login instead.');
      return false;
    }
    
    const userData = { email, role: 'user', id: Date.now() };
    const profile = {
      email,
      name: profileData.name || email.split('@')[0],
      age: profileData.age || '',
      gender: profileData.gender || '',
      height: profileData.height || '',
      weight: profileData.weight || '',
      sleepGoal: profileData.sleepGoal || '8 hours',
      createdAt: new Date().toISOString()
    };
    
    setUser(userData);
    setUserProfile(profile);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem(`profile_${email}`, JSON.stringify(profile));
    return true;
  };

  const updateProfile = (profileData) => {
    const updatedProfile = { ...userProfile, ...profileData, updatedAt: new Date().toISOString() };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(updatedProfile));
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
  };

  const resetPassword = (email) => {
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, login, signup, logout, resetPassword, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};