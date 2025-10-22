import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Moon, Sun, Volume2, AlarmClock } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CalendarAlarm = () => {
  const { sleepData } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [alarmSettings, setAlarmSettings] = useState({
    enabled: false,
    startTime: '06:30',
    endTime: '07:00',
    selectedSound: 'gentle-piano',
    volume: 50
  });
  const [alarmStatus, setAlarmStatus] = useState('inactive');
  const audioContextRef = useRef(null);

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

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getSleepData = (date) => {
    const dateStr = formatDate(date);
    return sleepData.calendarData[dateStr];
  };

  const getQualityClass = (quality) => {
    if (quality >= 80) return 'good';
    if (quality >= 60) return 'average';
    return 'poor';
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDate(date);
      const sleepInfo = getSleepData(date);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${sleepInfo ? getQualityClass(sleepInfo.quality) : ''}`}
          onClick={() => setSelectedDate(sleepInfo ? { date: dateStr, ...sleepInfo } : null)}
        >
          <span className="day-number">{day}</span>
          {sleepInfo && (
            <div className="sleep-indicator">
              <div className={`quality-dot ${getQualityClass(sleepInfo.quality)}`}></div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const wakeUpSounds = [
    { id: 'gentle-piano', name: 'Gentle Piano' },
    { id: 'nature-birds', name: 'Nature Birds' },
    { id: 'soft-chimes', name: 'Soft Chimes' }
  ];

  const toggleAlarm = () => {
    setAlarmSettings(prev => ({ ...prev, enabled: !prev.enabled }));
    if (alarmSettings.enabled) {
      setAlarmStatus('inactive');
    }
  };

  return (
    <div className="calendar-alarm-page">
      <h1>Sleep Calendar & Smart Alarm</h1>
      
      <div className="calendar-alarm-grid">
        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-container">
            <div className="calendar-header">
              <button onClick={() => navigateMonth(-1)}>
                <ChevronLeft size={20} />
              </button>
              <h2>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={() => navigateMonth(1)}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="days-grid">
                {renderCalendar()}
              </div>
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="legend-dot good"></div>
                <span>Good Sleep (80%+)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot average"></div>
                <span>Average Sleep (60-79%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot poor"></div>
                <span>Poor Sleep (&lt;60%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alarm Section */}
        <div className="alarm-section">
          <div className="alarm-container">
            <div className="alarm-header">
              <AlarmClock size={32} />
              <div>
                <h3>Smart Wake-Up</h3>
                <p>AI-powered gentle awakening</p>
              </div>
            </div>

            <div className="alarm-settings">
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
                <select
                  value={alarmSettings.selectedSound}
                  onChange={(e) => setAlarmSettings(prev => ({ ...prev, selectedSound: e.target.value }))}
                >
                  {wakeUpSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>{sound.name}</option>
                  ))}
                </select>
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
                onClick={toggleAlarm}
              >
                {alarmSettings.enabled ? '🔔 Alarm ON' : '🔕 Alarm OFF'}
              </button>
            </div>

            <div className="alarm-info">
              <h4>How It Works</h4>
              <ul>
                <li>🧠 Monitors your sleep phases</li>
                <li>⏰ Wakes you during light sleep</li>
                <li>🎵 Gentle 2-minute fade-in</li>
                <li>😌 Feel refreshed, not groggy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Popup */}
      {selectedDate && (
        <div className="date-summary-popup" onClick={() => setSelectedDate(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Sleep Summary - {selectedDate.date}</h3>
              <button onClick={() => setSelectedDate(null)}>×</button>
            </div>
            <div className="sleep-summary">
              <div className="summary-item">
                <span>Sleep Quality</span>
                <span className={getQualityClass(selectedDate.quality)}>{selectedDate.quality}%</span>
              </div>
              <div className="summary-item">
                <span>Duration</span>
                <span>{selectedDate.duration}</span>
              </div>
              <div className="summary-item">
                <span>Sleep Type</span>
                <span>{selectedDate.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAlarm;