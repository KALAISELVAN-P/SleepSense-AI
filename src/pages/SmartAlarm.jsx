import { useState, useEffect, useRef } from 'react';
import { Clock, Moon, Sun, Volume2, Settings, Play, Pause } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const SmartAlarm = () => {
  const { sleepData } = useData();
  const [alarmSettings, setAlarmSettings] = useState({
    enabled: false,
    startTime: '06:30',
    endTime: '07:00',
    selectedSound: 'gentle-piano',
    volume: 50
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sleepPhase, setSleepPhase] = useState('deep');
  const [alarmStatus, setAlarmStatus] = useState('inactive');
  const [fadeInProgress, setFadeInProgress] = useState(0);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = context;
      } catch (error) {
        console.log('Web Audio API not supported');
      }
    };
    initAudio();
  }, []);

  // AI Sleep Phase Detection
  const detectSleepPhase = (heartRate, motion) => {
    if (heartRate < 55 && motion < 5) return 'deep';
    if (heartRate < 65 && motion < 15) return 'light';
    return 'rem';
  };

  // Smart Wake-Up Algorithm
  useEffect(() => {
    if (!alarmSettings.enabled) return;

    const checkWakeUpTime = () => {
      const now = new Date();
      const [startHour, startMin] = alarmSettings.startTime.split(':').map(Number);
      const [endHour, endMin] = alarmSettings.endTime.split(':').map(Number);
      
      const startTime = new Date(now);
      startTime.setHours(startHour, startMin, 0, 0);
      
      const endTime = new Date(now);
      endTime.setHours(endHour, endMin, 0, 0);

      if (now >= startTime && now <= endTime) {
        const currentPhase = detectSleepPhase(
          sleepData.currentMetrics.heartRate,
          sleepData.currentMetrics.motion
        );
        setSleepPhase(currentPhase);

        // Wake up during light sleep or at end time
        if (currentPhase === 'light' || now >= endTime) {
          triggerSmartWakeUp();
        }
      }
    };

    const interval = setInterval(checkWakeUpTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [alarmSettings, sleepData.currentMetrics]);

  // Gentle Sound Generation
  const createGentleSound = (type) => {
    if (!audioContextRef.current) return null;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    switch (type) {
      case 'gentle-piano':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(261.63, context.currentTime); // C4
        break;
      case 'nature-birds':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
        break;
      case 'soft-chimes':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
        break;
      default:
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, context.currentTime);
    }

    gainNode.gain.setValueAtTime(0, context.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    return { oscillator, gainNode };
  };

  // Fade-in Wake-Up Sound
  const triggerSmartWakeUp = () => {
    setAlarmStatus('waking');
    const sound = createGentleSound(alarmSettings.selectedSound);
    
    if (sound) {
      const { oscillator, gainNode } = sound;
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      oscillator.start();

      // 2-minute gentle fade-in
      const fadeDuration = 120; // seconds
      const targetVolume = (alarmSettings.volume / 100) * 0.3;
      
      gainNode.gain.linearRampToValueAtTime(targetVolume, 
        audioContextRef.current.currentTime + fadeDuration);

      // Update fade progress
      let progress = 0;
      const fadeInterval = setInterval(() => {
        progress += 1;
        setFadeInProgress((progress / fadeDuration) * 100);
        
        if (progress >= fadeDuration) {
          clearInterval(fadeInterval);
          setAlarmStatus('active');
        }
      }, 1000);
    }
  };

  const stopAlarm = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
    setAlarmStatus('inactive');
    setFadeInProgress(0);
    setAlarmSettings(prev => ({ ...prev, enabled: false }));
  };

  const wakeUpSounds = [
    { id: 'gentle-piano', name: 'Gentle Piano', description: 'Soft triangular waves' },
    { id: 'nature-birds', name: 'Nature Birds', description: 'High frequency chirps' },
    { id: 'soft-chimes', name: 'Soft Chimes', description: 'Pure sine wave bells' }
  ];

  const getOptimalWakeTime = () => {
    const [startHour, startMin] = alarmSettings.startTime.split(':').map(Number);
    const [endHour, endMin] = alarmSettings.endTime.split(':').map(Number);
    
    // Simulate AI prediction based on current sleep phase
    const currentPhase = detectSleepPhase(
      sleepData.currentMetrics.heartRate,
      sleepData.currentMetrics.motion
    );
    
    if (currentPhase === 'light') {
      return 'Now (light sleep detected)';
    }
    
    // Estimate next light sleep phase (typically every 90 minutes)
    const avgCycleTime = 90; // minutes
    const nextLightPhase = new Date();
    nextLightPhase.setMinutes(nextLightPhase.getMinutes() + avgCycleTime);
    
    if (nextLightPhase.getHours() <= endHour) {
      return nextLightPhase.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
  };

  return (
    <div className="smart-alarm">
      <h1>Smart Wake-Up</h1>
      
      <div className="alarm-overview">
        <div className="current-status">
          <div className="status-card">
            <Clock size={32} />
            <div>
              <h3>{currentTime.toLocaleTimeString()}</h3>
              <p>Current Time</p>
            </div>
          </div>
          
          <div className="status-card">
            <Moon size={32} />
            <div>
              <h3>{sleepPhase.charAt(0).toUpperCase() + sleepPhase.slice(1)}</h3>
              <p>Sleep Phase</p>
            </div>
          </div>
          
          <div className="status-card">
            <Sun size={32} />
            <div>
              <h3>{getOptimalWakeTime()}</h3>
              <p>Optimal Wake Time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="alarm-settings">
        <div className="settings-card">
          <h3>🧠 AI Wake-Up Settings</h3>
          <p>I'll wake you gently at the best point in your sleep cycle — feeling refreshed, not groggy.</p>
          
          <div className="setting-group">
            <label>Wake-Up Window</label>
            <div className="time-range">
              <input
                type="time"
                value={alarmSettings.startTime}
                onChange={(e) => setAlarmSettings(prev => ({ ...prev, startTime: e.target.value }))}
              />
              <span>to</span>
              <input
                type="time"
                value={alarmSettings.endTime}
                onChange={(e) => setAlarmSettings(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="setting-group">
            <label>Wake-Up Sound</label>
            <div className="sound-options">
              {wakeUpSounds.map(sound => (
                <button
                  key={sound.id}
                  className={`sound-option ${alarmSettings.selectedSound === sound.id ? 'selected' : ''}`}
                  onClick={() => setAlarmSettings(prev => ({ ...prev, selectedSound: sound.id }))}
                >
                  <span className="sound-name">{sound.name}</span>
                  <span className="sound-desc">{sound.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Volume</label>
            <div className="volume-control">
              <Volume2 size={20} />
              <input
                type="range"
                min="10"
                max="100"
                value={alarmSettings.volume}
                onChange={(e) => setAlarmSettings(prev => ({ ...prev, volume: e.target.value }))}
              />
              <span>{alarmSettings.volume}%</span>
            </div>
          </div>

          <button
            className={`alarm-toggle ${alarmSettings.enabled ? 'enabled' : ''}`}
            onClick={() => setAlarmSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
          >
            {alarmSettings.enabled ? 'Disable Smart Alarm' : 'Enable Smart Alarm'}
          </button>
        </div>

        <div className="sleep-metrics">
          <h3>📊 Current Sleep Metrics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Heart Rate</span>
              <span className="metric-value">{sleepData.currentMetrics.heartRate} BPM</span>
            </div>
            <div className="metric">
              <span className="metric-label">Movement</span>
              <span className="metric-value">{sleepData.currentMetrics.motion} events</span>
            </div>
            <div className="metric">
              <span className="metric-label">Sleep Quality</span>
              <span className="metric-value">{sleepData.currentMetrics.quality}%</span>
            </div>
          </div>
        </div>
      </div>

      {alarmStatus !== 'inactive' && (
        <div className="wake-up-active">
          <div className="wake-up-card">
            <h3>🌅 Smart Wake-Up Active</h3>
            {alarmStatus === 'waking' && (
              <div className="fade-progress">
                <p>Gently waking you up...</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${fadeInProgress}%` }}
                  ></div>
                </div>
                <span>{Math.round(fadeInProgress)}% complete</span>
              </div>
            )}
            
            {alarmStatus === 'active' && (
              <p>Good morning! You were woken during light sleep for optimal refreshment.</p>
            )}
            
            <button className="stop-alarm" onClick={stopAlarm}>
              Stop Alarm
            </button>
          </div>
        </div>
      )}

      <div className="how-it-works">
        <h3>🧠 How Smart Wake-Up Works</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">📊</span>
            <div>
              <h4>Sleep Phase Detection</h4>
              <p>Monitors heart rate and movement to identify light sleep phases</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <div>
              <h4>Optimal Timing</h4>
              <p>Wakes you during light sleep within your specified window</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎵</span>
            <div>
              <h4>Gentle Fade-In</h4>
              <p>2-minute gradual sound increase for natural awakening</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAlarm;