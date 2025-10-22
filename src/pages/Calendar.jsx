import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Calendar = () => {
  const { sleepData } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarSleepData = sleepData.calendarData;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getSleepQualityClass = (quality) => {
    if (quality >= 80) return 'good';
    if (quality >= 60) return 'average';
    return 'poor';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="calendar-page">
      <h1>Sleep History Calendar</h1>

      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => navigateMonth(-1)}>
            <ChevronLeft />
          </button>
          <h2>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => navigateMonth(1)}>
            <ChevronRight />
          </button>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          <div className="days-grid">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="empty-day"></div>;
              }

              const dateStr = formatDate(date);
              const sleepDataForDate = calendarSleepData[dateStr];
              const isToday = dateStr === formatDate(new Date());

              return (
                <div
                  key={index}
                  className={`calendar-day ${sleepDataForDate ? getSleepQualityClass(sleepDataForDate.quality) : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <span className="day-number">{date.getDate()}</span>
                  {sleepDataForDate && (
                    <div className="sleep-indicator">
                      <div className="quality-dot"></div>
                    </div>
                  )}
                </div>
              );
            })}
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

      {selectedDate && (
        <div className="date-summary-popup">
          <div className="popup-content">
            <div className="popup-header">
              <CalendarIcon />
              <h3>{selectedDate.toDateString()}</h3>
              <button onClick={() => setSelectedDate(null)}>×</button>
            </div>
            
            {calendarSleepData[formatDate(selectedDate)] ? (
              <div className="sleep-summary">
                <div className="summary-item">
                  <span>Sleep Quality:</span>
                  <span className={getSleepQualityClass(calendarSleepData[formatDate(selectedDate)].quality)}>
                    {calendarSleepData[formatDate(selectedDate)].quality}%
                  </span>
                </div>
                <div className="summary-item">
                  <span>Sleep Type:</span>
                  <span>{calendarSleepData[formatDate(selectedDate)].type}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{calendarSleepData[formatDate(selectedDate)].duration}</span>
                </div>
              </div>
            ) : (
              <p>No sleep data available for this date</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;