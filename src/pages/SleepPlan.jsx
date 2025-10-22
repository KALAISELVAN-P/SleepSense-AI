import { Target, Lightbulb, Clock, Moon, Heart, Activity } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const SleepPlan = () => {
  const { sleepData } = useData();

  const recommendations = sleepData.aiInsights.recommendations.map(rec => ({
    ...rec,
    icon: rec.title.includes('Sleep') ? <Clock /> : 
          rec.title.includes('Environment') ? <Moon /> :
          rec.title.includes('Exercise') ? <Activity /> : <Lightbulb />
  }));

  const goals = [
    { 
      title: 'Improve Sleep Quality', 
      progress: Math.min(100, sleepData.currentMetrics.quality), 
      target: '85%+',
      current: `${sleepData.currentMetrics.quality}%`
    },
    { 
      title: 'Optimize Heart Rate', 
      progress: sleepData.currentMetrics.heartRate < 65 ? 90 : sleepData.currentMetrics.heartRate < 70 ? 70 : 50, 
      target: '< 65 BPM',
      current: `${sleepData.currentMetrics.heartRate} BPM`
    },
    { 
      title: 'Reduce Sleep Disruptions', 
      progress: sleepData.currentMetrics.motion < 10 ? 90 : sleepData.currentMetrics.motion < 15 ? 70 : 40, 
      target: '< 10 events',
      current: `${sleepData.currentMetrics.motion} events`
    }
  ];

  return (
    <div className="sleep-plan">
      <h1>Sleep Plan & Recommendations</h1>

      <div className="recommendations-section">
        <h3>AI-Generated Recommendations</h3>
        <div className="recommendations-grid">
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card ${rec.priority}`}>
              <div className="rec-icon">{rec.icon}</div>
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
              <span className={`priority ${rec.priority}`}>{rec.priority} priority</span>
            </div>
          ))}
        </div>
      </div>

      <div className="goals-section">
        <h3>Sleep Goals</h3>
        <div className="goals-list">
          {goals.map((goal, index) => (
            <div key={index} className="goal-item">
              <div className="goal-info">
                <h4>{goal.title}</h4>
                <span className="target">Target: {goal.target}</span>
                <span className="current">Current: {goal.current}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{goal.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sleep-tips">
        <h3>💡 Sleep Improvement Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🌙 Bedtime Routine</h4>
            <p>Establish a consistent bedtime routine 1 hour before sleep. Dim lights, avoid screens, and try relaxation techniques.</p>
          </div>
          <div className="tip-card">
            <h4>🌡️ Sleep Environment</h4>
            <p>Keep your bedroom cool (65-68°F), dark, and quiet. Consider blackout curtains and white noise machines.</p>
          </div>
          <div className="tip-card">
            <h4>🧘 Relaxation Techniques</h4>
            <p>Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Practice progressive muscle relaxation.</p>
          </div>
          <div className="tip-card">
            <h4>📱 Digital Wellness</h4>
            <p>Stop using electronic devices 1 hour before bed. Blue light can interfere with your natural sleep cycle.</p>
          </div>
        </div>
        
        <div className="chat-notice">
          <p>💬 Need personalized advice? Use the chat button in the bottom-right corner to talk with our Sleep Coach AI!</p>
        </div>
      </div>
    </div>
  );
};

export default SleepPlan;