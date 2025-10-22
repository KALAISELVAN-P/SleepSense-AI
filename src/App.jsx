import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIInsights from './pages/AIInsights';
import Graphs from './pages/Graphs';
import LifestyleTracker from './pages/LifestyleTracker';
import SleepPlan from './pages/SleepPlan';
import Reports from './pages/Reports';
import SleepSounds from './pages/SleepSounds';
import CalendarAlarm from './pages/CalendarAlarm';
import AIAnalytics from './pages/AIAnalytics';
import Settings from './pages/Settings';
import Support from './pages/Support';
import SleepGame from './pages/SleepGame';
import { useAuth } from './contexts/AuthContext';
import FloatingChat from './components/FloatingChat';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <div className="main-layout">
          {user && <TopBar />}
          <main className={`main-content ${user ? 'with-topbar' : ''}`}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/ai-insights" element={
                <ProtectedRoute><AIInsights /></ProtectedRoute>
              } />
              <Route path="/graphs" element={
                <ProtectedRoute><Graphs /></ProtectedRoute>
              } />
              <Route path="/lifestyle" element={
                <ProtectedRoute><LifestyleTracker /></ProtectedRoute>
              } />
              <Route path="/sleep-plan" element={
                <ProtectedRoute><SleepPlan /></ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute><Reports /></ProtectedRoute>
              } />
              <Route path="/sleep-sounds" element={
                <ProtectedRoute><SleepSounds /></ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute><CalendarAlarm /></ProtectedRoute>
              } />
              <Route path="/ai-analytics" element={
                <ProtectedRoute><AIAnalytics /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute><Support /></ProtectedRoute>
              } />
              <Route path="/sleep-game" element={
                <ProtectedRoute><SleepGame /></ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          {user && <FloatingChat />}
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
