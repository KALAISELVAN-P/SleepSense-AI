import { useState } from 'react';
import { Heart, Droplets, Activity, Volume2, Upload, Moon, CheckCircle, AlertCircle, Brain, Target, TrendingUp, Zap, Star, Clock, Eye, Timer, BarChart3, Settings, Award, Shield } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import InteractiveDataInput from './InteractiveDataInput';

const EnhancedDashboard = () => {
  const { sleepData, updateManualMetrics, importData, getCalculatedMetrics, getPersonalizedRecommendations } = useData();
  const currentMetrics = sleepData.currentMetrics;
  
  const [showInteractiveInput, setShowInteractiveInput] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const calculatedMetrics = getCalculatedMetrics();
  const personalizedRecs = getPersonalizedRecommendations();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const fileType = file.name.split('.').pop().toLowerCase();
      
      if (!['json', 'csv'].includes(fileType)) {
        throw new Error('Please upload a JSON or CSV file');
      }

      const fileContent = await readFileContent(file);
      const result = importData(fileContent, fileType);
      
      setUploadStatus(result);
      
      e.target.value = '';
    } catch (error) {
      setUploadStatus({ success: false, message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, color = 'primary', trend }) => (
    <div className={`enhanced-metric-card ${color}`}>
      <div className="metric-icon">
        <Icon size={32} />
      </div>
      <div className="metric-content">
        <h3>{title}</h3>
        <div className="metric-value">{value}</div>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`metric-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
            <TrendingUp size={16} />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = 'primary' }) => (
    <div className={`quick-action-card ${color}`} onClick={onClick}>
      <div className="action-icon">
        <Icon size={24} />
      </div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className="action-arrow">→</div>
    </div>
  );

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-icon">
            <BarChart3 size={40} />
          </div>
          <div>
            <h1>Sleep Analytics Dashboard</h1>
            <p>Comprehensive sleep tracking and insights powered by AI</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn primary"
            onClick={() => setShowInteractiveInput(!showInteractiveInput)}
          >
            <Settings size={20} />
            {showInteractiveInput ? 'Hide' : 'Show'} Advanced Input
          </button>
        </div>
      </div>

      {/* Sleep Quality Overview */}
      <div className="quality-overview">
        <div className="overview-card main">
          <div className="overview-content">
            <div className="quality-score">
              <div className="score-circle">
                <div className="score-value">{currentMetrics.quality}%</div>
                <div className="score-label">Sleep Quality</div>
              </div>
            </div>
            <div className="quality-details">
              <div className="detail-item">
                <Clock size={16} />
                <span>Duration: {currentMetrics.duration}</span>
              </div>
              <div className="detail-item">
                <Activity size={16} />
                <span>Type: {currentMetrics.type}</span>
              </div>
              <div className="detail-item">
                <Heart size={16} />
                <span>HR: {currentMetrics.heartRate} BPM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-stats">
          <MetricCard
            icon={Zap}
            title="Sleep Efficiency"
            value={`${calculatedMetrics.sleepEfficiency || 0}%`}
            subtitle="Target: 85%+"
            color="success"
            trend={calculatedMetrics.weeklyTrend}
          />
          <MetricCard
            icon={Brain}
            title="Sleep Cycles"
            value={calculatedMetrics.sleepCycles || 0}
            subtitle="Optimal: 5-6"
            color="primary"
          />
          <MetricCard
            icon={Target}
            title="Consistency"
            value={`${calculatedMetrics.consistencyScore || 0}%`}
            subtitle="Weekly average"
            color="warning"
          />
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="advanced-metrics">
        <h2>
          <Activity size={24} />
          Advanced Sleep Metrics
        </h2>
        <div className="metrics-grid">
          <MetricCard
            icon={Heart}
            title="Heart Rate"
            value={`${currentMetrics.heartRate} BPM`}
            subtitle={`Avg: ${calculatedMetrics.avgHeartRate || 'N/A'}`}
            color="danger"
          />
          <MetricCard
            icon={Droplets}
            title="SpO₂ Level"
            value={`${currentMetrics.spo2 || 98}%`}
            subtitle="Oxygen saturation"
            color="primary"
          />
          <MetricCard
            icon={Volume2}
            title="Motion Level"
            value={currentMetrics.motion || 8}
            subtitle="Movement during sleep"
            color="warning"
          />
          <MetricCard
            icon={Eye}
            title="Sleep Latency"
            value={`${calculatedMetrics.sleepLatency || 15} min`}
            subtitle="Time to fall asleep"
            color="success"
          />
          <MetricCard
            icon={Timer}
            title="WASO"
            value={`${calculatedMetrics.waso || 20} min`}
            subtitle="Wake after sleep onset"
            color="warning"
          />
          <MetricCard
            icon={Star}
            title="Sleep Debt"
            value={`${calculatedMetrics.sleepDebt || 0}h`}
            subtitle="Accumulated deficit"
            color="danger"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>
          <Zap size={24} />
          Quick Actions
        </h2>
        <div className="actions-grid">
          <QuickActionCard
            icon={BarChart3}
            title="Interactive Data Input"
            description="Comprehensive sleep and lifestyle tracking"
            onClick={() => setShowInteractiveInput(true)}
            color="primary"
          />
          <QuickActionCard
            icon={Upload}
            title="Import Sleep Data"
            description="Upload CSV or JSON files"
            onClick={() => document.getElementById('file-upload').click()}
            color="success"
          />
          <QuickActionCard
            icon={Brain}
            title="AI Sleep Analysis"
            description="Get personalized insights"
            onClick={() => window.location.href = '/ai-insights'}
            color="warning"
          />
          <QuickActionCard
            icon={Target}
            title="Set Sleep Goals"
            description="Define your sleep objectives"
            onClick={() => window.location.href = '/sleep-plan'}
            color="danger"
          />
        </div>
      </div>

      {/* File Upload (Hidden) */}
      <input 
        id="file-upload"
        type="file" 
        accept=".csv,.json" 
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Upload Status */}
      {uploadStatus && (
        <div className={`upload-notification ${uploadStatus.success ? 'success' : 'error'}`}>
          {uploadStatus.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{uploadStatus.message}</span>
          <button onClick={() => setUploadStatus(null)}>×</button>
        </div>
      )}

      {/* Live Recommendations */}
      {personalizedRecs.length > 0 && (
        <div className="live-recommendations-enhanced">
          <div className="recommendations-header">
            <div className="header-icon">
              <Brain size={24} />
            </div>
            <div>
              <h2>AI-Powered Recommendations</h2>
              <p>Personalized insights based on your sleep patterns</p>
            </div>
          </div>
          <div className="recommendations-carousel">
            {personalizedRecs.slice(0, 4).map((rec, index) => (
              <div key={index} className={`recommendation-card-enhanced ${rec.priority}`}>
                <div className="rec-priority">
                  <span className={`priority-indicator ${rec.priority}`}></span>
                  {rec.priority}
                </div>
                <div className="rec-icon-large">{rec.icon}</div>
                <div className="rec-content-enhanced">
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                </div>
                <div className="rec-action">
                  <button className="implement-btn">Implement</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Data Input Modal */}
      {showInteractiveInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Advanced Sleep Data Input</h2>
              <button 
                className="close-modal"
                onClick={() => setShowInteractiveInput(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <InteractiveDataInput />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;