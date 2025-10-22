import { useState } from 'react';
import { Coffee, Smartphone, Dumbbell, Clock } from 'lucide-react';

const LifestyleTracker = () => {
  const [lifestyle, setLifestyle] = useState({
    caffeine: '',
    screenTime: '',
    exercise: '',
    bedtime: '',
    wakeTime: ''
  });

  const [logs, setLogs] = useState([
    { date: '2024-01-15', caffeine: 2, screenTime: 6, exercise: 30, sleepQuality: 85 },
    { date: '2024-01-14', caffeine: 3, screenTime: 8, exercise: 0, sleepQuality: 72 },
    { date: '2024-01-13', caffeine: 1, screenTime: 4, exercise: 45, sleepQuality: 92 }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      date: new Date().toISOString().split('T')[0],
      ...lifestyle,
      sleepQuality: Math.floor(Math.random() * 30) + 70
    };
    setLogs([newLog, ...logs]);
    setLifestyle({ caffeine: '', screenTime: '', exercise: '', bedtime: '', wakeTime: '' });
  };

  return (
    <div className="lifestyle-tracker">
      <h1>Lifestyle Tracker</h1>

      <div className="tracker-form">
        <h3>Log Today's Activities</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Coffee className="icon" />
            <input
              type="number"
              placeholder="Caffeine intake (cups)"
              value={lifestyle.caffeine}
              onChange={(e) => setLifestyle(prev => ({...prev, caffeine: e.target.value}))}
            />
          </div>
          
          <div className="input-group">
            <Smartphone className="icon" />
            <input
              type="number"
              placeholder="Screen time (hours)"
              value={lifestyle.screenTime}
              onChange={(e) => setLifestyle(prev => ({...prev, screenTime: e.target.value}))}
            />
          </div>
          
          <div className="input-group">
            <Dumbbell className="icon" />
            <input
              type="number"
              placeholder="Exercise duration (minutes)"
              value={lifestyle.exercise}
              onChange={(e) => setLifestyle(prev => ({...prev, exercise: e.target.value}))}
            />
          </div>
          
          <div className="input-group">
            <Clock className="icon" />
            <input
              type="time"
              placeholder="Bedtime"
              value={lifestyle.bedtime}
              onChange={(e) => setLifestyle(prev => ({...prev, bedtime: e.target.value}))}
            />
          </div>
          
          <div className="input-group">
            <Clock className="icon" />
            <input
              type="time"
              placeholder="Wake time"
              value={lifestyle.wakeTime}
              onChange={(e) => setLifestyle(prev => ({...prev, wakeTime: e.target.value}))}
            />
          </div>
          
          <button type="submit">Log Activities</button>
        </form>
      </div>

      <div className="correlation-analysis">
        <h3>Sleep Quality Correlations</h3>
        <div className="correlation-cards">
          <div className="correlation-card">
            <h4>Caffeine Impact</h4>
            <p>Higher caffeine intake correlates with 15% lower sleep quality</p>
          </div>
          <div className="correlation-card">
            <h4>Exercise Benefits</h4>
            <p>30+ minutes of exercise improves sleep quality by 20%</p>
          </div>
          <div className="correlation-card">
            <h4>Screen Time Effect</h4>
            <p>Excessive screen time reduces deep sleep by 12%</p>
          </div>
        </div>
      </div>

      <div className="activity-log">
        <h3>Recent Activity Log</h3>
        <div className="log-table">
          <div className="log-header">
            <span>Date</span>
            <span>Caffeine</span>
            <span>Screen Time</span>
            <span>Exercise</span>
            <span>Sleep Quality</span>
          </div>
          {logs.map((log, index) => (
            <div key={index} className="log-row">
              <span>{log.date}</span>
              <span>{log.caffeine} cups</span>
              <span>{log.screenTime}h</span>
              <span>{log.exercise}min</span>
              <span className={`quality ${log.sleepQuality > 80 ? 'good' : 'average'}`}>
                {log.sleepQuality}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LifestyleTracker;