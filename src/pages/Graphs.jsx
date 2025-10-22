import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from 'recharts';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const Graphs = () => {
  const { sleepData } = useData();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('week');
  const [showAgeComparison, setShowAgeComparison] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  const getAgeGroupAverages = (userAge) => {
    if (userAge < 18) return { heartRate: 75, spo2: 97, motion: 12, snoring: 3 };
    if (userAge <= 60) return { heartRate: 68, spo2: 96, motion: 8, snoring: 4 };
    return { heartRate: 72, spo2: 95, motion: 6, snoring: 5 };
  };

  const chartData = useMemo(() => {
    const dailyData = sleepData.dailyData;
    const ageAverages = user?.age ? getAgeGroupAverages(user.age) : null;
    
    if (timeFilter === 'week') {
      return dailyData.slice(-7).map(d => ({
        day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
        heartRate: d.heartRate,
        spo2: d.spo2,
        motion: d.motion,
        snoring: d.snoring,
        ...(showAgeComparison && ageAverages && {
          avgHeartRate: ageAverages.heartRate,
          avgSpo2: ageAverages.spo2,
          avgMotion: ageAverages.motion,
          avgSnoring: ageAverages.snoring
        })
      }));
    } else if (timeFilter === 'month') {
      const weeks = [];
      for (let i = 0; i < Math.min(4, Math.ceil(dailyData.length / 7)); i++) {
        const weekData = dailyData.slice(i * 7, (i + 1) * 7);
        if (weekData.length > 0) {
          const avgData = {
            week: `Week ${i + 1}`,
            heartRate: Math.round(weekData.reduce((sum, d) => sum + d.heartRate, 0) / weekData.length),
            spo2: Math.round(weekData.reduce((sum, d) => sum + d.spo2, 0) / weekData.length),
            motion: Math.round(weekData.reduce((sum, d) => sum + d.motion, 0) / weekData.length),
            snoring: Math.round(weekData.reduce((sum, d) => sum + d.snoring, 0) / weekData.length),
            ...(showAgeComparison && ageAverages && {
              avgHeartRate: ageAverages.heartRate,
              avgSpo2: ageAverages.spo2,
              avgMotion: ageAverages.motion,
              avgSnoring: ageAverages.snoring
            })
          };
          weeks.push(avgData);
        }
      }
      return weeks;
    } else {
      const dayData = [
        { time: '22:00', heartRate: 70, spo2: 98, motion: 5, snoring: 2 },
        { time: '23:00', heartRate: 65, spo2: 97, motion: 8, snoring: 4 },
        { time: '00:00', heartRate: 60, spo2: 96, motion: 12, snoring: 6 },
        { time: '01:00', heartRate: 58, spo2: 95, motion: 15, snoring: 8 },
        { time: '02:00', heartRate: 55, spo2: 94, motion: 10, snoring: 5 },
        { time: '03:00', heartRate: 52, spo2: 93, motion: 8, snoring: 3 },
        { time: '04:00', heartRate: 50, spo2: 94, motion: 6, snoring: 2 },
        { time: '05:00', heartRate: 55, spo2: 95, motion: 4, snoring: 1 },
        { time: '06:00', heartRate: 62, spo2: 97, motion: 2, snoring: 0 }
      ];
      return dayData.map(d => ({
        ...d,
        ...(showAgeComparison && ageAverages && {
          avgHeartRate: ageAverages.heartRate,
          avgSpo2: ageAverages.spo2,
          avgMotion: ageAverages.motion,
          avgSnoring: ageAverages.snoring
        })
      }));
    }
  }, [sleepData.dailyData, timeFilter, showAgeComparison, user?.age]);

  const currentData = chartData;

  const renderChart = (title, dataKey, color) => {
    const xAxisKey = timeFilter === 'day' ? 'time' : timeFilter === 'week' ? 'day' : 'week';
    const avgKey = `avg${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}`;

    if (chartType === 'area') {
      return (
        <div className="chart-container" key={title}>
          <h3>{title}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} name="Your Data" />
              {showAgeComparison && (
                <Area type="monotone" dataKey={avgKey} stroke="#95a5a6" fill="#95a5a6" fillOpacity={0.1} strokeDasharray="5 5" name="Age Group Avg" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className="chart-container" key={title}>
          <h3>{title}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={color} name="Your Data" />
              {showAgeComparison && (
                <Bar dataKey={avgKey} fill="#95a5a6" name="Age Group Avg" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else {
      return (
        <div className="chart-container" key={title}>
          <h3>{title}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} name="Your Data" />
              {showAgeComparison && (
                <Line type="monotone" dataKey={avgKey} stroke="#95a5a6" strokeWidth={2} strokeDasharray="5 5" name="Age Group Avg" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <div className="graphs-page">
      <h1>Sleep Trends & Analytics</h1>
      
      <div className="filter-controls">
        <div className="time-filters">
          <button 
            className={timeFilter === 'day' ? 'active' : ''}
            onClick={() => setTimeFilter('day')}
          >
            Day
          </button>
          <button 
            className={timeFilter === 'week' ? 'active' : ''}
            onClick={() => setTimeFilter('week')}
          >
            Week
          </button>
          <button 
            className={timeFilter === 'month' ? 'active' : ''}
            onClick={() => setTimeFilter('month')}
          >
            Month
          </button>
        </div>
        
        <div className="chart-controls">
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          
          <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="all">All Metrics</option>
            <option value="heartRate">Heart Rate Only</option>
            <option value="spo2">SpO₂ Only</option>
            <option value="motion">Motion Only</option>
            <option value="snoring">Snoring Only</option>
          </select>
        </div>
        
        {user?.age && (
          <div className="age-comparison-filter">
            <label>
              <input
                type="checkbox"
                checked={showAgeComparison}
                onChange={(e) => setShowAgeComparison(e.target.checked)}
              />
              Compare with age group ({user.age} yrs)
            </label>
          </div>
        )}
      </div>

      {selectedMetric === 'all' ? (
        <div className="charts-grid">
          {renderChart('Heart Rate Trends', 'heartRate', '#e74c3c')}
          {renderChart('SpO₂ Levels', 'spo2', '#3498db')}
          {renderChart('Motion Activity', 'motion', '#2ecc71')}
          {renderChart('Snoring Frequency', 'snoring', '#f39c12')}
        </div>
      ) : (
        <div className="single-chart">
          {renderChart(
            selectedMetric === 'heartRate' ? 'Heart Rate Trends' :
            selectedMetric === 'spo2' ? 'SpO₂ Levels' :
            selectedMetric === 'motion' ? 'Motion Activity' : 'Snoring Frequency',
            selectedMetric,
            selectedMetric === 'heartRate' ? '#e74c3c' :
            selectedMetric === 'spo2' ? '#3498db' :
            selectedMetric === 'motion' ? '#2ecc71' : '#f39c12'
          )}
        </div>
      )}

      <div className="trend-summary">
        <h3>Trend Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <span>Avg Heart Rate:</span>
            <span>{Math.round(currentData.reduce((sum, d) => sum + d.heartRate, 0) / currentData.length)} BPM</span>
          </div>
          <div className="stat">
            <span>Avg SpO₂:</span>
            <span>{Math.round(currentData.reduce((sum, d) => sum + d.spo2, 0) / currentData.length)}%</span>
          </div>
          <div className="stat">
            <span>Motion Events:</span>
            <span>{(currentData.reduce((sum, d) => sum + d.motion, 0) / currentData.length).toFixed(1)}/night</span>
          </div>
          <div className="stat">
            <span>Snoring Level:</span>
            <span>{(currentData.reduce((sum, d) => sum + d.snoring, 0) / currentData.length).toFixed(1)}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;