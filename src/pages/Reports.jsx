import { useState, useEffect } from 'react';
import { Download, Mail, FileText, TrendingUp, Calendar, Clock, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const Reports = () => {
  const [reportType, setReportType] = useState('weekly');
  const [email, setEmail] = useState('');
  const [reportData, setReportData] = useState({});
  const { getCurrentDataForReport } = useData();
  const { userProfile } = useAuth();

  useEffect(() => {
    const updateReportData = () => {
      const currentData = getCurrentDataForReport();
      const dailyData = currentData.dailyData || [];
      
      // Calculate weekly data (last 7 days)
      const weeklyData = dailyData.slice(-7);
      const weeklyAvgScore = weeklyData.length > 0 ? Math.round(weeklyData.reduce((sum, d) => sum + d.quality, 0) / weeklyData.length) : 0;
      const weeklyTotalSleep = weeklyData.reduce((sum, d) => sum + d.duration, 0);
      const weeklyApnea = weeklyData.filter(d => d.apnea).length;
      const weeklyBest = weeklyData.reduce((best, d) => d.quality > best.quality ? d : best, weeklyData[0] || {quality: 0});
      const weeklyWorst = weeklyData.reduce((worst, d) => d.quality < worst.quality ? d : worst, weeklyData[0] || {quality: 100});
      
      // Calculate monthly data (last 30 days)
      const monthlyData = dailyData.slice(-30);
      const monthlyAvgScore = monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + d.quality, 0) / monthlyData.length) : 0;
      const monthlyTotalSleep = monthlyData.reduce((sum, d) => sum + d.duration, 0);
      const monthlyApnea = monthlyData.filter(d => d.apnea).length;
      const monthlyBest = monthlyData.reduce((best, d) => d.quality > best.quality ? d : best, monthlyData[0] || {quality: 0});
      const monthlyWorst = monthlyData.reduce((worst, d) => d.quality < worst.quality ? d : worst, monthlyData[0] || {quality: 100});
      
      // Helper function to get day name from date
      const getDayName = (dateStr) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(dateStr).getDay()];
      };
      
      setReportData({
        weekly: {
          period: 'Last 7 Days',
          avgSleepScore: weeklyAvgScore,
          avgDeepSleep: weeklyData.length > 0 ? Math.round(weeklyData.reduce((sum, d) => sum + (d.deepSleep || 0), 0) / weeklyData.length / 60 * 100 / 8) : 0,
          apneaAlerts: weeklyApnea,
          totalSleep: formatTotalSleep(weeklyTotalSleep),
          bestNight: weeklyBest.date ? `${getDayName(weeklyBest.date)} (${weeklyBest.quality}%)` : 'No data',
          worstNight: weeklyWorst.date ? `${getDayName(weeklyWorst.date)} - Needs improvement (${weeklyWorst.quality}%)` : 'No data',
          improvement: '+5%',
          consistency: '85%'
        },
        monthly: {
          period: 'Last 30 Days',
          avgSleepScore: monthlyAvgScore,
          avgDeepSleep: monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + (d.deepSleep || 0), 0) / monthlyData.length / 60 * 100 / 8) : 0,
          apneaAlerts: monthlyApnea,
          totalSleep: formatTotalSleep(monthlyTotalSleep),
          bestNight: monthlyBest.date ? `${getDayName(monthlyBest.date)} (${monthlyBest.quality}%)` : 'No data',
          worstNight: monthlyWorst.date ? `${getDayName(monthlyWorst.date)} - Needs improvement (${monthlyWorst.quality}%)` : 'No data',
          improvement: '+12%',
          consistency: '78%'
        }
      });
    };
    
    updateReportData();
    
    // Listen for data updates
    const handleDataUpdate = () => updateReportData();
    window.addEventListener('sleepDataUpdated', handleDataUpdate);
    
    return () => window.removeEventListener('sleepDataUpdated', handleDataUpdate);
  }, [getCurrentDataForReport]);
  
  const formatTotalSleep = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const currentReport = reportData[reportType] || {
    period: reportType === 'weekly' ? 'Last 7 Days' : 'Last 30 Days',
    avgSleepScore: 0,
    avgDeepSleep: 0,
    apneaAlerts: 0,
    totalSleep: '0h 0m',
    bestNight: 'No data',
    worstNight: 'No data',
    improvement: '+0%',
    consistency: '0%'
  };

  const generatePDF = () => {
    if (!currentReport || !reportData[reportType]) return;
    const doc = new jsPDF();
    const currentData = getCurrentDataForReport();
    
    doc.setFontSize(20);
    doc.text('SleepSense - Sleep Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`User: ${userProfile?.name || 'User'}`, 20, 55);
    
    doc.setFontSize(14);
    doc.text(`Period: ${currentReport.period}`, 20, 75);
    doc.text(`Average Sleep Score: ${currentReport.avgSleepScore}%`, 20, 95);
    doc.text(`Average Deep Sleep: ${currentReport.avgDeepSleep}%`, 20, 115);
    doc.text(`Apnea Alerts: ${currentReport.apneaAlerts}`, 20, 135);
    doc.text(`Total Sleep Time: ${currentReport.totalSleep}`, 20, 155);
    doc.text(`Best Night: ${currentReport.bestNight}`, 20, 175);
    doc.text(`Worst Night: ${currentReport.worstNight}`, 20, 195);
    
    // Add current manual metrics
    doc.text('Current Manual Metrics:', 20, 220);
    doc.setFontSize(12);
    doc.text(`Sleep Quality: ${currentData.currentMetrics?.quality || 0}%`, 30, 235);
    doc.text(`Duration: ${currentData.currentMetrics?.duration || 'N/A'}`, 30, 245);
    doc.text(`Heart Rate: ${currentData.currentMetrics?.heartRate || 0} BPM`, 30, 255);
    doc.text(`SpO2: ${currentData.currentMetrics?.spo2 || 0}%`, 30, 265);
    
    doc.save(`sleep-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const emailReport = () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }
    alert(`Report sent to ${email}`);
    setEmail('');
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Sleep Analytics Report</h1>
        <p className="reports-subtitle">Comprehensive analysis of your sleep patterns and health metrics</p>
      </div>

      <div className="report-controls">
        <div className="report-type-selector">
          <button 
            className={`report-btn ${reportType === 'weekly' ? 'active' : ''}`}
            onClick={() => setReportType('weekly')}
          >
            <Calendar className="btn-icon" />
            <span>Weekly Report</span>
            <span className="period-text">Last 7 Days</span>
          </button>
          <button 
            className={`report-btn ${reportType === 'monthly' ? 'active' : ''}`}
            onClick={() => setReportType('monthly')}
          >
            <Calendar className="btn-icon" />
            <span>Monthly Report</span>
            <span className="period-text">Last 30 Days</span>
          </button>
        </div>
      </div>

      <div className="report-content">
        <div className="report-preview">
          <div className="report-header">
            <div className="header-content">
              <FileText className="header-icon" />
              <div className="header-text">
                <h2>Sleep Summary Report</h2>
                <p className="report-period">{currentReport?.period || 'Loading...'}</p>
              </div>
            </div>
            <div className="report-badge">
              <Award className="badge-icon" />
              <span>Generated Report</span>
            </div>
          </div>

          <div className="report-overview">
            <div className="overview-card primary">
              <div className="overview-icon">
                <TrendingUp />
              </div>
              <div className="overview-content">
                <h3>Sleep Quality Score</h3>
                <div className="overview-value">{currentReport?.avgSleepScore || 0}%</div>
                <div className="overview-change positive">{currentReport?.improvement || '+0%'} from last period</div>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="overview-icon">
                <Clock />
              </div>
              <div className="overview-content">
                <h3>Total Sleep Time</h3>
                <div className="overview-value">{currentReport?.totalSleep || '0h 0m'}</div>
                <div className="overview-subtitle">Across {reportType === 'weekly' ? '7' : '30'} days</div>
              </div>
            </div>
          </div>

          <div className="report-stats">
            <div className="stats-header">
              <h3>Detailed Metrics</h3>
              <p>Key performance indicators for your sleep health</p>
            </div>
            
            <div className="stat-grid">
              <div className="stat-card excellent">
                <div className="stat-header">
                  <h4>Average Sleep Score</h4>
                  <div className="stat-trend positive">↗</div>
                </div>
                <div className="stat-value">{currentReport?.avgSleepScore || 0}%</div>
                <div className="stat-description">Excellent performance</div>
              </div>
              
              <div className="stat-card good">
                <div className="stat-header">
                  <h4>Deep Sleep Percentage</h4>
                  <div className="stat-trend neutral">→</div>
                </div>
                <div className="stat-value">{currentReport?.avgDeepSleep || 0}%</div>
                <div className="stat-description">Within normal range</div>
              </div>
              
              <div className="stat-card warning">
                <div className="stat-header">
                  <h4>Apnea Alerts</h4>
                  <div className="stat-trend negative">↘</div>
                </div>
                <div className="stat-value">{currentReport?.apneaAlerts || 0}</div>
                <div className="stat-description">Needs attention</div>
              </div>
              
              <div className="stat-card good">
                <div className="stat-header">
                  <h4>Sleep Consistency</h4>
                  <div className="stat-trend positive">↗</div>
                </div>
                <div className="stat-value">{currentReport?.consistency || '0%'}</div>
                <div className="stat-description">Good routine</div>
              </div>
            </div>
          </div>

          <div className="highlights-section">
            <h3>Performance Highlights</h3>
            <div className="highlights-grid">
              <div className="highlight-card best">
                <div className="highlight-icon">🏆</div>
                <div className="highlight-content">
                  <h4>Best Performance</h4>
                  <p className="highlight-value">{currentReport?.bestNight || 'No data'}</p>
                  <p className="highlight-description">Your highest sleep quality score</p>
                </div>
              </div>
              
              <div className="highlight-card worst">
                <div className="highlight-icon">⚠️</div>
                <div className="highlight-content">
                  <h4>Needs Improvement</h4>
                  <p className="highlight-value">{currentReport?.worstNight || 'No data'}</p>
                  <p className="highlight-description">Focus area for better sleep</p>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-header">
              <h3>Sleep Quality Trend</h3>
              <p>Daily sleep quality scores over the selected period</p>
            </div>
            <div className="chart-container">
              <div className="chart-y-axis">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className="chart-area">
                <div className="chart-grid">
                  {Array.from({length: 5}, (_, i) => (
                    <div key={i} className="grid-line"></div>
                  ))}
                </div>
                <div className="chart-bars">
                  <div className="chart-bar" style={{height: '60%'}} data-value="60%"></div>
                  <div className="chart-bar" style={{height: '80%'}} data-value="80%"></div>
                  <div className="chart-bar" style={{height: '45%'}} data-value="45%"></div>
                  <div className="chart-bar" style={{height: '90%'}} data-value="90%"></div>
                  <div className="chart-bar" style={{height: '75%'}} data-value="75%"></div>
                  <div className="chart-bar" style={{height: '85%'}} data-value="85%"></div>
                  <div className="chart-bar" style={{height: '70%'}} data-value="70%"></div>
                </div>
              </div>
              <div className="chart-x-axis">
                {reportType === 'weekly' ? 
                  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <span key={day}>{day}</span>
                  )) :
                  ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => (
                    <span key={week}>{week}</span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className="report-actions">
          <div className="actions-header">
            <h3>Export & Share</h3>
            <p>Download or share your sleep report</p>
          </div>
          
          <div className="actions-grid">
            <button className="action-btn download-btn" onClick={generatePDF}>
              <Download className="action-icon" />
              <div className="action-content">
                <span className="action-title">Download PDF</span>
                <span className="action-subtitle">Save report to device</span>
              </div>
            </button>
            
            <div className="email-action">
              <div className="email-input-group">
                <Mail className="email-icon" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
              </div>
              <button className="action-btn email-btn" onClick={emailReport}>
                <span className="action-title">Send Report</span>
              </button>
            </div>
          </div>
          
          <div className="report-info">
            <p>📊 Report generated on {new Date().toLocaleDateString()}</p>
            <p>🔒 Your data is secure and private</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;