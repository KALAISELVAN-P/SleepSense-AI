import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Trophy, TrendingUp, RefreshCw, BarChart3 } from 'lucide-react';

const SleepGame = () => {
  const { sleepData } = useData();
  const navigate = useNavigate();
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [streak, setStreak] = useState(0);
  const [animalHistory, setAnimalHistory] = useState([]);

  const getAnimalLevel = (sleepScore) => {
    if (sleepScore > 90) {
      return {
        animal: 'Kaniska',
        emoji: '🐨',
        message: "You're a Sleep Kaniska! Calm, comfy, and deeply rested.",
        color: '#10b981',
        level: 'Extraordinary'
      };
    } else if (sleepScore > 75) {
      return {
        animal: 'Lathika',
        emoji: '🐵',
        message: "You're a Sleep Lathika! Smart and energetic sleep.",
        color: '#f59e0b',
        level: 'Good'
      };
    } else if (sleepScore > 50) {
      return {
        animal: 'Panda',
        emoji: '🐼',
        message: "You're a Sleep Panda! Try more consistency.",
        color: '#6366f1',
        level: 'Average'
      };
    } else {
      return {
        animal: 'Elephant',
        emoji: '🐘',
        message: "You're a Sleep Elephant! Heavy day, try better rest tonight.",
        color: '#ef4444',
        level: 'Needs Improvement'
      };
    }
  };

  useEffect(() => {
    const sleepScore = sleepData.currentMetrics?.quality || 0;
    const animal = getAnimalLevel(sleepScore);
    setCurrentAnimal(animal);

    // Load history from localStorage
    const savedHistory = localStorage.getItem('sleepAnimalHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setAnimalHistory(history);
      
      // Calculate streak
      const recentAnimals = history.slice(-7);
      let currentStreak = 0;
      for (let i = recentAnimals.length - 1; i >= 0; i--) {
        if (recentAnimals[i].level === 'Extraordinary' || recentAnimals[i].level === 'Good') {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }

    // Save today's animal
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...(animalHistory || [])];
    const todayIndex = newHistory.findIndex(h => h.date === today);
    
    if (todayIndex >= 0) {
      newHistory[todayIndex] = { date: today, ...animal, score: sleepScore };
    } else {
      newHistory.push({ date: today, ...animal, score: sleepScore });
    }
    
    localStorage.setItem('sleepAnimalHistory', JSON.stringify(newHistory.slice(-30))); // Keep last 30 days
  }, [sleepData]);

  const getMotivationalQuote = (level, score) => {
    if (level === 'Good' && score >= 80) {
      return "தூக்குதுரை❌தூங்குதுரை✅";
    }
    
    const quotes = {
      'Extraordinary': [
        "Dreams are your superpower. Keep it up! ✨",
        "You're mastering the art of sleep! 🌟",
        "Sleep champion mode activated! 🏆"
      ],
      'Good': [
        "Great sleep leads to great days! 💪",
        "தூக்குதுரை❌தூங்குதுரை✅",
        "தூக்குதுரை❌தூங்குதுரை✅"
      ],
      'Average': [
        "Every night is a new chance! 🌙",
        "Small improvements lead to big changes! 📈",
        "You've got this! Keep trying! 💫"
      ],
      'Needs Improvement': [
        "Tomorrow is a fresh start! 🌅",
        "Rest is not a luxury, it's a necessity! 💤",
        "Your future self will thank you! 🙏"
      ]
    };
    
    const levelQuotes = quotes[level] || quotes['Average'];
    return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
  };

  const refreshScore = () => {
    window.location.reload();
  };

  if (!currentAnimal) return <div className="loading">Loading your sleep animal...</div>;

  return (
    <div className="sleep-game">
      <h1>🐾 Sleep Animal Challenge</h1>
      
      <div className="game-layout">
        <div className="animal-card">
        <div className="animal-emoji" style={{ color: currentAnimal.color }}>
          {currentAnimal.emoji}
        </div>
        <h2>Your Sleep Animal: {currentAnimal.animal}</h2>
        <div className="sleep-score">
          Sleep Score: <span style={{ color: currentAnimal.color }}>{sleepData.currentMetrics?.quality || 0}%</span>
        </div>
        <div className="level-badge" style={{ backgroundColor: currentAnimal.color }}>
          {currentAnimal.level} Sleep
        </div>
        <p className="animal-message">{currentAnimal.message}</p>
        <div className="motivational-quote">
          "{getMotivationalQuote(currentAnimal.level, sleepData.currentMetrics?.quality || 0)}"
        </div>
        </div>
        
        <div className="sleep-chart">
          <h3>Sleep Level Guide</h3>
          <div className="percentage-chart">
            <div className="chart-section koala" style={{ backgroundColor: currentAnimal.level === 'Extraordinary' ? '#10b981' : '#f0f9ff' }}>
              <div className="section-content">
                <span className="section-emoji">🐨</span>
                <div className="section-info">
                  <strong>90%+ Kaniska</strong>
                  <p>Extraordinary Sleep</p>
                </div>
              </div>
            </div>
            
            <div className="chart-section lathika" style={{ backgroundColor: currentAnimal.level === 'Good' ? '#f59e0b' : '#fefce8' }}>
              <div className="section-content">
                <span className="section-emoji">🐵</span>
                <div className="section-info">
                  <strong>75-90% Lathika</strong>
                  <p>Good Sleep</p>
                </div>
              </div>
            </div>
            
            <div className="chart-section panda" style={{ backgroundColor: currentAnimal.level === 'Average' ? '#6366f1' : '#f8fafc' }}>
              <div className="section-content">
                <span className="section-emoji">🐼</span>
                <div className="section-info">
                  <strong>50-75% Panda</strong>
                  <p>Average Sleep</p>
                </div>
              </div>
            </div>
            
            <div className="chart-section elephant" style={{ backgroundColor: currentAnimal.level === 'Needs Improvement' ? '#ef4444' : '#fef2f2' }}>
              <div className="section-content">
                <span className="section-emoji">🐘</span>
                <div className="section-info">
                  <strong>&lt;50% Elephant</strong>
                  <p>Needs Improvement</p>
                </div>
              </div>
            </div>
            
            <div className="current-score">
              <div className="score-indicator">
                <div className="score-badge">
                  <span className="badge-emoji">{currentAnimal.emoji}</span>
                  <div className="badge-content">
                    <div className="badge-title">My Level</div>
                    <div className="badge-score">{sleepData.currentMetrics?.quality || 0}%</div>
                    <div className="badge-name">{currentAnimal.animal}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {streak > 0 && (
        <div className="streak-card">
          <Trophy className="streak-icon" />
          <h3>Sleep Streak!</h3>
          <p>You've maintained good sleep for <strong>{streak}</strong> night{streak > 1 ? 's' : ''} in a row!</p>
        </div>
      )}

      <div className="animal-history">
        <h3>🏆 Your Sleep Journey</h3>
        <div className="history-grid">
          {animalHistory.slice(-7).map((entry, index) => (
            <div key={index} className="history-item">
              <div className="history-emoji">{entry.emoji}</div>
              <div className="history-date">{new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}</div>
              <div className="history-score">{entry.score}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="game-actions">
        <button className="action-btn primary" onClick={() => navigate('/dashboard')}>
          <BarChart3 size={20} />
          View My Sleep Stats
        </button>
        <button className="action-btn secondary" onClick={refreshScore}>
          <RefreshCw size={20} />
          Refresh Score
        </button>
        <button className="action-btn tertiary" onClick={() => navigate('/ai-insights')}>
          <TrendingUp size={20} />
          Get AI Insights
        </button>
      </div>
    </div>
  );
};

export default SleepGame;