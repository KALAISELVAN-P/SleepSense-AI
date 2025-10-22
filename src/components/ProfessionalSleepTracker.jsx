import { useState, useEffect } from 'react';
import { 
  Heart, 
  Droplets, 
  Activity, 
  Volume2, 
  Upload, 
  Moon, 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  Star, 
  Clock, 
  Eye, 
  Timer, 
  BarChart3, 
  Settings, 
  Award, 
  Shield,
  Coffee,
  Utensils,
  Dumbbell,
  Smartphone,
  Thermometer,
  Wind,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Lightbulb,
  User,
  Calendar
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const ProfessionalSleepTracker = () => {
  const { sleepData, updateManualMetrics, importData, getCalculatedMetrics, getPersonalizedRecommendations } = useData();
  const { userProfile } = useAuth();
  const currentMetrics = sleepData.currentMetrics;
  
  const [activeSection, setActiveSection] = useState('overview');
  const [showAdvancedInput, setShowAdvancedInput] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Comprehensive sleep data state
  const [sleepMetrics, setSleepMetrics] = useState({
    // Basic metrics
    sleepDuration: '',
    bedTime: '',
    wakeTime: '',
    sleepQuality: 7,
    sleepLatency: '',
    nightWakings: 0,
    feelingRested: 7,
    
    // Advanced physiological
    heartRate: '',
    spo2: '',
    motion: '',
    snoring: '',
    bodyTemperature: '',
    
    // Environmental
    roomTemperature: '',
    humidity: '',
    noiseLevel: '',
    roomDarkness: 8,
    mattressComfort: 8,
    
    // Lifestyle factors
    caffeineIntake: 0,
    alcoholIntake: 0,
    exerciseDuration: '',
    exerciseIntensity: 5,
    screenTimeBeforeBed: '',
    stressLevel: 5,
    moodRating: 7,
    
    // Goals
    targetSleepDuration: '8',
    targetBedTime: '22:00',
    targetWakeTime: '06:00'
  });

  const calculatedMetrics = getCalculatedMetrics();
  const personalizedRecs = getPersonalizedRecommendations();

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleMetricChange = (field, value) => {
    setSleepMetrics(prev => ({ ...prev, [field]: value }));
  };

  const calculateOverallQuality = () => {
    const quality = sleepMetrics.sleepQuality;
    const rested = sleepMetrics.feelingRested;
    const stress = 10 - sleepMetrics.stressLevel;
    const environment = (sleepMetrics.roomDarkness + sleepMetrics.mattressComfort) / 2;
    
    return Math.round((quality * 0.4 + rested * 0.3 + stress * 0.2 + environment * 0.1));
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const allMetrics = {
        quality: calculateOverallQuality(),
        duration: sleepMetrics.sleepDuration || '8h 0m',
        bedTime: sleepMetrics.bedTime,
        wakeTime: sleepMetrics.wakeTime,
        sleepLatency: parseInt(sleepMetrics.sleepLatency) || 15,
        nightWakings: sleepMetrics.nightWakings,
        heartRate: parseInt(sleepMetrics.heartRate) || 65,
        spo2: parseInt(sleepMetrics.spo2) || 98,
        motion: parseInt(sleepMetrics.motion) || 8,
        snoring: parseInt(sleepMetrics.snoring) || 2,
        roomTemperature: parseFloat(sleepMetrics.roomTemperature) || 20,
        humidity: parseFloat(sleepMetrics.humidity) || 45,
        stressLevel: sleepMetrics.stressLevel,
        exerciseMinutes: parseInt(sleepMetrics.exerciseDuration) || 0,
        caffeineIntake: sleepMetrics.caffeineIntake,
        screenTime: parseInt(sleepMetrics.screenTimeBeforeBed) || 30,
        type: determineType()
      };

      await updateManualMetrics(allMetrics);
      
      setSubmitStatus({
        type: 'success',
        message: '✅ Sleep data updated successfully! All analytics have been refreshed with your new data.'
      });
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '❌ Failed to update data. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const determineType = () => {
    const spo2 = parseInt(sleepMetrics.spo2) || 98;
    const snoring = parseInt(sleepMetrics.snoring) || 2;
    const motion = parseInt(sleepMetrics.motion) || 8;
    const quality = calculateOverallQuality();
    
    if (spo2 < 90 || snoring > 7) return 'Apnea';
    if (motion > 20) return 'Restless';
    if (quality < 70) return 'Light';
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

  const resetForm = () => {
    setSleepMetrics({
      sleepDuration: '',
      bedTime: '',
      wakeTime: '',
      sleepQuality: 7,
      sleepLatency: '',
      nightWakings: 0,
      feelingRested: 7,
      heartRate: '',
      spo2: '',
      motion: '',
      snoring: '',
      bodyTemperature: '',
      roomTemperature: '',
      humidity: '',
      noiseLevel: '',
      roomDarkness: 8,
      mattressComfort: 8,
      caffeineIntake: 0,
      alcoholIntake: 0,
      exerciseDuration: '',
      exerciseIntensity: 5,
      screenTimeBeforeBed: '',
      stressLevel: 5,
      moodRating: 7,
      targetSleepDuration: '8',
      targetBedTime: '22:00',
      targetWakeTime: '06:00'
    });
    setSubmitStatus(null);
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, color = 'primary', trend, size = 'normal' }) => (
    <div className={`professional-metric-card ${color} ${size}`}>
      <div className="metric-header">
        <div className="metric-icon-container">
          <Icon size={size === 'large' ? 32 : 24} />
        </div>
        <div className="metric-info">
          <h3>{title}</h3>
          {trend && (
            <div className={`metric-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
              <TrendingUp size={14} />
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const SliderInput = ({ label, value, onChange, min = 0, max = 10, step = 1, icon: Icon, unit = '', color = 'primary' }) => (
    <div className="professional-slider-group">
      <div className="slider-header">
        <label className="slider-label">
          {Icon && <Icon size={16} />}
          <span>{label}</span>
        </label>
        <span className={`slider-value-display ${color}`}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`professional-slider ${color}`}
      />
      <div className="slider-range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  const SectionButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      className={`section-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="professional-sleep-tracker">
      {/* Header Section */}
      <div className="tracker-header">
        <div className="header-main">
          <div className="header-icon">
            <BarChart3 size={48} />
          </div>
          <div className="header-content">
            <h1>Professional Sleep Analytics</h1>
            <p>Comprehensive sleep tracking with AI-powered insights and personalized recommendations</p>
          </div>
        </div>
        {userProfile && (
          <div className="user-profile-card">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <div className="profile-info">
              <h3>{userProfile.name}</h3>
              <p>Age: {userProfile.age} • Goal: {userProfile.sleepGoal}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="section-navigation">
        <SectionButton
          id="overview"
          label="Sleep Overview"
          icon={Moon}
          isActive={activeSection === 'overview'}
          onClick={setActiveSection}
        />
        <SectionButton
          id="metrics"
          label="Advanced Metrics"
          icon={Activity}
          isActive={activeSection === 'metrics'}
          onClick={setActiveSection}
        />
        <SectionButton
          id="input"
          label="Data Input"
          icon={Settings}
          isActive={activeSection === 'input'}
          onClick={setActiveSection}
        />
        <SectionButton
          id="recommendations"
          label="AI Insights"
          icon={Brain}
          isActive={activeSection === 'recommendations'}
          onClick={setActiveSection}
        />
      </div>

      {/* Sleep Overview Section */}
      {activeSection === 'overview' && (
        <div className="overview-section">
          <div className="main-quality-card">
            <div className="quality-circle-container">
              <div className="quality-circle" style={{'--quality': currentMetrics.quality}}>
                <div className="quality-score">
                  <span className="score-number">{currentMetrics.quality}%</span>
                  <span className="score-label">Sleep Quality</span>
                </div>
              </div>
            </div>
            <div className="quality-details">
              <div className="detail-row">
                <Clock size={18} />
                <span>Duration: {currentMetrics.duration}</span>
              </div>
              <div className="detail-row">
                <Activity size={18} />
                <span>Type: {currentMetrics.type}</span>
              </div>
              <div className="detail-row">
                <Heart size={18} />
                <span>Heart Rate: {currentMetrics.heartRate} BPM</span>
              </div>
            </div>
          </div>

          <div className="overview-metrics">
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
              title="Consistency Score"
              value={`${calculatedMetrics.consistencyScore || 0}%`}
              subtitle="Weekly average"
              color="warning"
            />
            <MetricCard
              icon={Timer}
              title="Sleep Debt"
              value={`${calculatedMetrics.sleepDebt || 0}h`}
              subtitle="Accumulated deficit"
              color="danger"
            />
          </div>
        </div>
      )}

      {/* Advanced Metrics Section */}
      {activeSection === 'metrics' && (
        <div className="metrics-section">
          <div className="metrics-header">
            <h2>
              <Activity size={28} />
              Advanced Sleep Analytics
            </h2>
            <p>Detailed physiological and environmental sleep data analysis</p>
          </div>

          <div className="metrics-categories">
            <div className="category-section">
              <h3>
                <Heart size={20} />
                Physiological Metrics
              </h3>
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
              </div>
            </div>

            <div className="category-section">
              <h3>
                <Shield size={20} />
                Sleep Quality Indicators
              </h3>
              <div className="metrics-grid">
                <MetricCard
                  icon={Timer}
                  title="WASO"
                  value={`${calculatedMetrics.waso || 20} min`}
                  subtitle="Wake after sleep onset"
                  color="warning"
                />
                <MetricCard
                  icon={Star}
                  title="REM Duration"
                  value={`${calculatedMetrics.remDuration || 90} min`}
                  subtitle="REM sleep time"
                  color="success"
                />
                <MetricCard
                  icon={Moon}
                  title="Deep Sleep"
                  value={`${calculatedMetrics.deepSleepDuration || 120} min`}
                  subtitle="Deep sleep duration"
                  color="primary"
                />
                <MetricCard
                  icon={Award}
                  title="Sleep Score"
                  value={calculatedMetrics.overallScore || 85}
                  subtitle="Comprehensive rating"
                  color="success"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Input Section */}
      {activeSection === 'input' && (
        <div className="input-section">
          <div className="input-header">
            <h2>
              <Settings size={28} />
              Comprehensive Sleep Data Input
            </h2>
            <p>Track all aspects of your sleep and lifestyle for personalized insights</p>
            <div className="input-actions">
              <button 
                className="toggle-advanced-btn"
                onClick={() => setShowAdvancedInput(!showAdvancedInput)}
              >
                {showAdvancedInput ? 'Simple View' : 'Advanced View'}
              </button>
              <label className="file-upload-btn">
                <Upload size={18} />
                <input 
                  type="file" 
                  accept=".csv,.json" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
                {isUploading ? 'Uploading...' : 'Import Data'}
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmitData} className="professional-form">
            {/* Basic Sleep Metrics */}
            <div className="form-category">
              <h3>
                <Moon size={20} />
                Basic Sleep Metrics
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <Clock size={16} />
                    Sleep Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 8h 30m"
                    value={sleepMetrics.sleepDuration}
                    onChange={(e) => handleMetricChange('sleepDuration', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <Moon size={16} />
                    Bed Time
                  </label>
                  <input
                    type="time"
                    value={sleepMetrics.bedTime}
                    onChange={(e) => handleMetricChange('bedTime', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <Zap size={16} />
                    Wake Time
                  </label>
                  <input
                    type="time"
                    value={sleepMetrics.wakeTime}
                    onChange={(e) => handleMetricChange('wakeTime', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <Timer size={16} />
                    Sleep Latency (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="Time to fall asleep"
                    value={sleepMetrics.sleepLatency}
                    onChange={(e) => handleMetricChange('sleepLatency', e.target.value)}
                  />
                </div>
              </div>

              <div className="sliders-section">
                <SliderInput
                  label="Sleep Quality Rating"
                  value={sleepMetrics.sleepQuality}
                  onChange={(value) => handleMetricChange('sleepQuality', value)}
                  min={1}
                  max={10}
                  icon={Star}
                  color="success"
                />
                <SliderInput
                  label="How Rested Do You Feel?"
                  value={sleepMetrics.feelingRested}
                  onChange={(value) => handleMetricChange('feelingRested', value)}
                  min={1}
                  max={10}
                  icon={Zap}
                  color="primary"
                />
                <SliderInput
                  label="Night Wakings"
                  value={sleepMetrics.nightWakings}
                  onChange={(value) => handleMetricChange('nightWakings', value)}
                  min={0}
                  max={10}
                  icon={Eye}
                  color="warning"
                />
              </div>
            </div>

            {/* Advanced Metrics (Conditional) */}
            {showAdvancedInput && (
              <>
                <div className="form-category">
                  <h3>
                    <Heart size={20} />
                    Physiological Data
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Heart Rate (BPM)</label>
                      <input
                        type="number"
                        placeholder="65"
                        value={sleepMetrics.heartRate}
                        onChange={(e) => handleMetricChange('heartRate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>SpO₂ (%)</label>
                      <input
                        type="number"
                        placeholder="98"
                        value={sleepMetrics.spo2}
                        onChange={(e) => handleMetricChange('spo2', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Body Temperature (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={sleepMetrics.bodyTemperature}
                        onChange={(e) => handleMetricChange('bodyTemperature', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="sliders-section">
                    <SliderInput
                      label="Motion Level"
                      value={parseInt(sleepMetrics.motion) || 5}
                      onChange={(value) => handleMetricChange('motion', value.toString())}
                      min={0}
                      max={20}
                      icon={Activity}
                      color="primary"
                    />
                    <SliderInput
                      label="Snoring Level"
                      value={parseInt(sleepMetrics.snoring) || 2}
                      onChange={(value) => handleMetricChange('snoring', value.toString())}
                      min={0}
                      max={10}
                      icon={Volume2}
                      color="warning"
                    />
                  </div>
                </div>

                <div className="form-category">
                  <h3>
                    <Coffee size={20} />
                    Lifestyle Factors
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Exercise Duration (minutes)</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={sleepMetrics.exerciseDuration}
                        onChange={(e) => handleMetricChange('exerciseDuration', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Screen Time Before Bed (minutes)</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={sleepMetrics.screenTimeBeforeBed}
                        onChange={(e) => handleMetricChange('screenTimeBeforeBed', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="sliders-section">
                    <SliderInput
                      label="Caffeine Intake (cups)"
                      value={sleepMetrics.caffeineIntake}
                      onChange={(value) => handleMetricChange('caffeineIntake', value)}
                      min={0}
                      max={8}
                      icon={Coffee}
                      color="warning"
                    />
                    <SliderInput
                      label="Stress Level"
                      value={sleepMetrics.stressLevel}
                      onChange={(value) => handleMetricChange('stressLevel', value)}
                      min={1}
                      max={10}
                      icon={Brain}
                      color="danger"
                    />
                    <SliderInput
                      label="Overall Mood"
                      value={sleepMetrics.moodRating}
                      onChange={(value) => handleMetricChange('moodRating', value)}
                      min={1}
                      max={10}
                      icon={Star}
                      color="success"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                <RotateCcw size={18} />
                Reset Form
              </button>
              
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Sleep Data
                  </>
                )}
              </button>
            </div>

            {submitStatus && (
              <div className={`submit-notification ${submitStatus.type}`}>
                {submitStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{submitStatus.message}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* AI Recommendations Section */}
      {activeSection === 'recommendations' && (
        <div className="recommendations-section">
          <div className="recommendations-header">
            <h2>
              <Brain size={28} />
              AI-Powered Sleep Insights
            </h2>
            <p>Personalized recommendations based on your sleep patterns and lifestyle data</p>
          </div>

          {personalizedRecs.length > 0 ? (
            <div className="recommendations-grid">
              {personalizedRecs.map((rec, index) => (
                <div key={index} className={`recommendation-card ${rec.priority}`}>
                  <div className="rec-header">
                    <div className="rec-icon">{rec.icon}</div>
                    <div className={`priority-badge ${rec.priority}`}>
                      {rec.priority} Priority
                    </div>
                  </div>
                  <div className="rec-content">
                    <h3>{rec.title}</h3>
                    <p>{rec.description}</p>
                  </div>
                  <div className="rec-actions">
                    <button className="implement-btn">
                      <Lightbulb size={16} />
                      Implement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recommendations">
              <Brain size={48} />
              <h3>No Recommendations Available</h3>
              <p>Add more sleep data to receive personalized AI insights and recommendations.</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Status Notification */}
      {uploadStatus && (
        <div className={`upload-notification ${uploadStatus.success ? 'success' : 'error'}`}>
          {uploadStatus.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{uploadStatus.message}</span>
          <button onClick={() => setUploadStatus(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSleepTracker;