import { useState } from 'react';
import { Heart, Droplets, Activity, Volume2, Upload, Moon, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Dashboard = () => {
  const { sleepData, updateManualMetrics, importData, getCalculatedMetrics, getPersonalizedRecommendations } = useData();
  const currentMetrics = sleepData.currentMetrics;
  
  const [manualInput, setManualInput] = useState({
    heartRate: '',
    spo2: '',
    motion: '',
    snoring: ''
  });
  
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const calculatedMetrics = getCalculatedMetrics();
  const personalizedRecs = getPersonalizedRecommendations();

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const updates = {};
    
    // Only update fields that have values
    if (manualInput.heartRate) updates.heartRate = parseInt(manualInput.heartRate);
    if (manualInput.spo2) updates.spo2 = parseInt(manualInput.spo2);
    if (manualInput.motion) updates.motion = parseInt(manualInput.motion);
    if (manualInput.snoring) updates.snoring = parseInt(manualInput.snoring);
    
    // Calculate quality based on new metrics
    if (Object.keys(updates).length > 0) {
      const newMetrics = { ...currentMetrics, ...updates };
      updates.quality = calculateQuality(newMetrics);
      updates.type = determineType(newMetrics);
      
      updateManualMetrics(updates);
      setManualInput({ heartRate: '', spo2: '', motion: '', snoring: '' });
      alert('✅ Data updated! Check all pages - graphs, AI insights, calendar, and reports now reflect your new values.');
    }
  };
  
  // Calculate sleep quality based on metrics
  const calculateQuality = (metrics) => {
    let score = 100;
    if (metrics.heartRate > 70) score -= 10;
    if (metrics.spo2 < 95) score -= 15;
    if (metrics.motion > 15) score -= 10;
    if (metrics.snoring > 5) score -= 8;
    return Math.max(50, Math.min(100, score));
  };
  
  // Determine sleep type
  const determineType = (metrics) => {
    if (metrics.spo2 < 90 || metrics.snoring > 7) return 'Apnea';
    if (metrics.motion > 20) return 'Restless';
    if (metrics.quality < 70) return 'Light';
    return 'Normal';
  };

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
      
      // Clear the file input
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

  return (
    <div className="dashboard">
      <h1>Sleep Dashboard</h1>
      
      <div className="sleep-summary">
        <div className="summary-card">
          <Moon className="icon" />
          <div>
            <h3>Sleep Quality</h3>
            <div className="score">{currentMetrics.quality}%</div>
          </div>
        </div>
        <div className="summary-card">
          <div>
            <h3>Duration</h3>
            <div className="duration">{currentMetrics.duration}</div>
          </div>
        </div>
        <div className="summary-card">
          <div>
            <h3>Sleep Type</h3>
            <div className="type">{currentMetrics.type}</div>
          </div>
        </div>
      </div>

      <div className="widgets">
        <div className="widget">
          <Heart className="widget-icon" />
          <h4>Heart Rate</h4>
          <div className="dial">{currentMetrics.heartRate} BPM</div>
          <span className="current">Avg: {calculatedMetrics.avgHeartRate || 'N/A'}</span>
        </div>
        <div className="widget">
          <Droplets className="widget-icon" />
          <h4>Sleep Efficiency</h4>
          <div className="dial">{calculatedMetrics.sleepEfficiency || 0}%</div>
          <span className="current">Target: 85%+</span>
        </div>
        <div className="widget">
          <Activity className="widget-icon" />
          <h4>Sleep Cycles</h4>
          <div className="dial">{calculatedMetrics.sleepCycles || 0}</div>
          <span className="current">Optimal: 5-6</span>
        </div>
        <div className="widget">
          <Volume2 className="widget-icon" />
          <h4>Consistency</h4>
          <div className="dial">{calculatedMetrics.consistencyScore || 0}%</div>
          <span className="current">Trend: {calculatedMetrics.weeklyTrend > 0 ? '+' : ''}{calculatedMetrics.weeklyTrend || 0}%</span>
        </div>
      </div>

      <div className="input-section">
        <div className="manual-input">
          <h3>Manual Input</h3>
          <form onSubmit={handleManualSubmit}>
            <input
              type="number"
              placeholder="Heart Rate (BPM)"
              value={manualInput.heartRate}
              onChange={(e) => setManualInput(prev => ({...prev, heartRate: e.target.value}))}
            />
            <input
              type="number"
              placeholder="SpO₂ (%)"
              value={manualInput.spo2}
              onChange={(e) => setManualInput(prev => ({...prev, spo2: e.target.value}))}
            />
            <input
              type="number"
              placeholder="Motion Level"
              value={manualInput.motion}
              onChange={(e) => setManualInput(prev => ({...prev, motion: e.target.value}))}
            />
            <input
              type="number"
              placeholder="Snoring Level"
              value={manualInput.snoring}
              onChange={(e) => setManualInput(prev => ({...prev, snoring: e.target.value}))}
            />
            <button type="submit">Update Data</button>
          </form>
          
          {personalizedRecs.length > 0 && (
            <div className="live-recommendations">
              <h4>💡 Live Recommendations</h4>
              {personalizedRecs.slice(0, 2).map((rec, index) => (
                <div key={index} className={`rec-item ${rec.priority}`}>
                  <span>{rec.icon}</span>
                  <div>
                    <strong>{rec.title}</strong>
                    <p>{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="file-upload">
          <h3>Upload Sleep Report</h3>
          <label className={`upload-btn ${isUploading ? 'uploading' : ''}`}>
            <Upload />
            <input 
              type="file" 
              accept=".csv,.json" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading ? 'Processing...' : 'Upload CSV/JSON'}
          </label>
          
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.success ? 'success' : 'error'}`}>
              {uploadStatus.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{uploadStatus.message}</span>
            </div>
          )}
          
          <div className="upload-info">
            <p><strong>Supported formats:</strong></p>
            <ul>
              <li><strong>CSV:</strong> date, sleepQuality, heartRate, spo2, motion, snoring, duration, deepSleep, apnea</li>
              <li><strong>JSON:</strong> Array of objects or single object with sleep data</li>
            </ul>
            <p><em>Uploading data will update all pages with new information.</em></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;