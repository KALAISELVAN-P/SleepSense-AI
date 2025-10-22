import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Droplets, 
  Activity, 
  Volume2, 
  Moon, 
  Sun, 
  Coffee, 
  Utensils, 
  Dumbbell, 
  Smartphone, 
  Brain, 
  Thermometer,
  Wind,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Award,
  RotateCcw,
  Save,
  Plus,
  Minus,
  Star,
  Eye,
  Lightbulb,
  Timer,
  BarChart3,
  Settings
} from 'lucide-react';

const InteractiveDataInput = () => {
  const { updateManualMetrics, getCalculatedMetrics, getPersonalizedRecommendations } = useData();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Basic Sleep Metrics
  const [basicMetrics, setBasicMetrics] = useState({
    sleepDuration: '',
    bedTime: '',
    wakeTime: '',
    sleepQuality: 7,
    sleepLatency: '',
    nightWakings: 0,
    feelingRested: 7
  });

  // Advanced Sleep Metrics
  const [advancedMetrics, setAdvancedMetrics] = useState({
    heartRate: '',
    spo2: '',
    motion: '',
    snoring: '',
    deepSleepDuration: '',
    remSleepDuration: '',
    lightSleepDuration: '',
    bodyTemperature: '',
    roomTemperature: '',
    humidity: '',
    noiseLevel: ''
  });

  // Lifestyle Factors
  const [lifestyleFactors, setLifestyleFactors] = useState({
    // Nutrition
    caffeineIntake: 0,
    alcoholIntake: 0,
    lastMealTime: '',
    waterIntake: 8,
    
    // Exercise
    exerciseType: '',
    exerciseDuration: '',
    exerciseIntensity: 5,
    exerciseTime: '',
    
    // Screen Time
    screenTimeBeforeBed: '',
    blueLight: false,
    
    // Mental Health
    stressLevel: 5,
    anxietyLevel: 3,
    moodRating: 7,
    meditationTime: '',
    
    // Environment
    roomDarkness: 8,
    mattressComfort: 8,
    pillowComfort: 8,
    noiseDisturbance: 2
  });

  // Goals and Targets
  const [goals, setGoals] = useState({
    targetSleepDuration: '8',
    targetBedTime: '22:00',
    targetWakeTime: '06:00',
    sleepQualityGoal: 85,
    consistencyGoal: 90,
    weeklyGoals: []
  });

  const calculatedMetrics = getCalculatedMetrics();
  const recommendations = getPersonalizedRecommendations();

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleBasicChange = (field, value) => {
    setBasicMetrics(prev => ({ ...prev, [field]: value }));
  };

  const handleAdvancedChange = (field, value) => {
    setAdvancedMetrics(prev => ({ ...prev, [field]: value }));
  };

  const handleLifestyleChange = (field, value) => {
    setLifestyleFactors(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalsChange = (field, value) => {
    setGoals(prev => ({ ...prev, [field]: value }));
  };

  const calculateOverallQuality = () => {
    const quality = basicMetrics.sleepQuality;
    const rested = basicMetrics.feelingRested;
    const stress = 10 - lifestyleFactors.stressLevel;
    const environment = (lifestyleFactors.roomDarkness + lifestyleFactors.mattressComfort) / 2;
    
    return Math.round((quality * 0.4 + rested * 0.3 + stress * 0.2 + environment * 0.1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Combine all metrics
      const allMetrics = {
        // Basic metrics
        quality: calculateOverallQuality(),
        duration: basicMetrics.sleepDuration || '8h 0m',
        bedTime: basicMetrics.bedTime,
        wakeTime: basicMetrics.wakeTime,
        sleepLatency: parseInt(basicMetrics.sleepLatency) || 15,
        nightWakings: basicMetrics.nightWakings,
        
        // Advanced metrics
        heartRate: parseInt(advancedMetrics.heartRate) || 65,
        spo2: parseInt(advancedMetrics.spo2) || 98,
        motion: parseInt(advancedMetrics.motion) || 8,
        snoring: parseInt(advancedMetrics.snoring) || 2,
        
        // Environmental
        roomTemperature: parseFloat(advancedMetrics.roomTemperature) || 20,
        humidity: parseFloat(advancedMetrics.humidity) || 45,
        
        // Lifestyle
        stressLevel: lifestyleFactors.stressLevel,
        exerciseMinutes: parseInt(lifestyleFactors.exerciseDuration) || 0,
        caffeineIntake: lifestyleFactors.caffeineIntake,
        screenTime: parseInt(lifestyleFactors.screenTimeBeforeBed) || 30,
        
        // Calculate type based on metrics
        type: determineType()
      };\n\n      await updateManualMetrics(allMetrics);\n      \n      setSubmitStatus({\n        type: 'success',\n        message: '✅ All sleep data updated successfully! Check your dashboard, graphs, and AI insights for updated analysis.'\n      });\n      \n      setShowRecommendations(true);\n      \n    } catch (error) {\n      setSubmitStatus({\n        type: 'error',\n        message: '❌ Failed to update data. Please try again.'\n      });\n    } finally {\n      setIsSubmitting(false);\n    }\n  };\n\n  const determineType = () => {\n    const spo2 = parseInt(advancedMetrics.spo2) || 98;\n    const snoring = parseInt(advancedMetrics.snoring) || 2;\n    const motion = parseInt(advancedMetrics.motion) || 8;\n    const quality = calculateOverallQuality();\n    \n    if (spo2 < 90 || snoring > 7) return 'Apnea';\n    if (motion > 20) return 'Restless';\n    if (quality < 70) return 'Light';\n    return 'Normal';\n  };\n\n  const resetForm = () => {\n    setBasicMetrics({\n      sleepDuration: '',\n      bedTime: '',\n      wakeTime: '',\n      sleepQuality: 7,\n      sleepLatency: '',\n      nightWakings: 0,\n      feelingRested: 7\n    });\n    setAdvancedMetrics({\n      heartRate: '',\n      spo2: '',\n      motion: '',\n      snoring: '',\n      deepSleepDuration: '',\n      remSleepDuration: '',\n      lightSleepDuration: '',\n      bodyTemperature: '',\n      roomTemperature: '',\n      humidity: '',\n      noiseLevel: ''\n    });\n    setLifestyleFactors({\n      caffeineIntake: 0,\n      alcoholIntake: 0,\n      lastMealTime: '',\n      waterIntake: 8,\n      exerciseType: '',\n      exerciseDuration: '',\n      exerciseIntensity: 5,\n      exerciseTime: '',\n      screenTimeBeforeBed: '',\n      blueLight: false,\n      stressLevel: 5,\n      anxietyLevel: 3,\n      moodRating: 7,\n      meditationTime: '',\n      roomDarkness: 8,\n      mattressComfort: 8,\n      pillowComfort: 8,\n      noiseDisturbance: 2\n    });\n    setSubmitStatus(null);\n  };\n\n  const SliderInput = ({ label, value, onChange, min = 0, max = 10, step = 1, icon: Icon, unit = '', color = 'primary' }) => (\n    <div className=\"slider-input-group\">\n      <label className=\"slider-label\">\n        {Icon && <Icon size={16} />}\n        <span>{label}</span>\n        <span className={`slider-value ${color}`}>{value}{unit}</span>\n      </label>\n      <input\n        type=\"range\"\n        min={min}\n        max={max}\n        step={step}\n        value={value}\n        onChange={(e) => onChange(parseFloat(e.target.value))}\n        className={`slider-input ${color}`}\n      />\n      <div className=\"slider-markers\">\n        <span>{min}</span>\n        <span>{max}</span>\n      </div>\n    </div>\n  );\n\n  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (\n    <button\n      type=\"button\"\n      className={`tab-button ${isActive ? 'active' : ''}`}\n      onClick={() => onClick(id)}\n    >\n      <Icon size={18} />\n      <span>{label}</span>\n    </button>\n  );\n\n  return (\n    <div className=\"interactive-data-input\">\n      <div className=\"input-header\">\n        <div className=\"header-content\">\n          <div className=\"header-icon\">\n            <BarChart3 size={32} />\n          </div>\n          <div>\n            <h2>Comprehensive Sleep Data Input</h2>\n            <p>Track all aspects of your sleep and lifestyle for personalized insights</p>\n          </div>\n        </div>\n        {userProfile && (\n          <div className=\"user-context\">\n            <div className=\"context-item\">\n              <User size={16} />\n              <span>{userProfile.name}</span>\n            </div>\n            <div className=\"context-item\">\n              <Calendar size={16} />\n              <span>Age: {userProfile.age}</span>\n            </div>\n            <div className=\"context-item\">\n              <Target size={16} />\n              <span>Goal: {userProfile.sleepGoal}</span>\n            </div>\n          </div>\n        )}\n      </div>\n\n      <div className=\"tab-navigation\">\n        <TabButton\n          id=\"basic\"\n          label=\"Sleep Basics\"\n          icon={Moon}\n          isActive={activeTab === 'basic'}\n          onClick={setActiveTab}\n        />\n        <TabButton\n          id=\"advanced\"\n          label=\"Advanced Metrics\"\n          icon={Activity}\n          isActive={activeTab === 'advanced'}\n          onClick={setActiveTab}\n        />\n        <TabButton\n          id=\"lifestyle\"\n          label=\"Lifestyle Factors\"\n          icon={Coffee}\n          isActive={activeTab === 'lifestyle'}\n          onClick={setActiveTab}\n        />\n        <TabButton\n          id=\"goals\"\n          label=\"Goals & Targets\"\n          icon={Target}\n          isActive={activeTab === 'goals'}\n          onClick={setActiveTab}\n        />\n      </div>\n\n      <form onSubmit={handleSubmit} className=\"input-form\">\n        {/* Basic Sleep Metrics Tab */}\n        {activeTab === 'basic' && (\n          <div className=\"tab-content\">\n            <div className=\"section-header\">\n              <Moon size={24} />\n              <div>\n                <h3>Basic Sleep Metrics</h3>\n                <p>Essential sleep tracking data</p>\n              </div>\n            </div>\n\n            <div className=\"form-grid\">\n              <div className=\"form-group\">\n                <label>\n                  <Clock size={16} />\n                  Sleep Duration\n                </label>\n                <input\n                  type=\"text\"\n                  placeholder=\"e.g., 8h 30m\"\n                  value={basicMetrics.sleepDuration}\n                  onChange={(e) => handleBasicChange('sleepDuration', e.target.value)}\n                />\n              </div>\n\n              <div className=\"form-group\">\n                <label>\n                  <Moon size={16} />\n                  Bed Time\n                </label>\n                <input\n                  type=\"time\"\n                  value={basicMetrics.bedTime}\n                  onChange={(e) => handleBasicChange('bedTime', e.target.value)}\n                />\n              </div>\n\n              <div className=\"form-group\">\n                <label>\n                  <Sun size={16} />\n                  Wake Time\n                </label>\n                <input\n                  type=\"time\"\n                  value={basicMetrics.wakeTime}\n                  onChange={(e) => handleBasicChange('wakeTime', e.target.value)}\n                />\n              </div>\n\n              <div className=\"form-group\">\n                <label>\n                  <Timer size={16} />\n                  Sleep Latency (minutes)\n                </label>\n                <input\n                  type=\"number\"\n                  placeholder=\"Time to fall asleep\"\n                  value={basicMetrics.sleepLatency}\n                  onChange={(e) => handleBasicChange('sleepLatency', e.target.value)}\n                />\n              </div>\n            </div>\n\n            <div className=\"slider-section\">\n              <SliderInput\n                label=\"Sleep Quality Rating\"\n                value={basicMetrics.sleepQuality}\n                onChange={(value) => handleBasicChange('sleepQuality', value)}\n                min={1}\n                max={10}\n                icon={Star}\n                color=\"success\"\n              />\n\n              <SliderInput\n                label=\"How Rested Do You Feel?\"\n                value={basicMetrics.feelingRested}\n                onChange={(value) => handleBasicChange('feelingRested', value)}\n                min={1}\n                max={10}\n                icon={Zap}\n                color=\"primary\"\n              />\n\n              <SliderInput\n                label=\"Night Wakings\"\n                value={basicMetrics.nightWakings}\n                onChange={(value) => handleBasicChange('nightWakings', value)}\n                min={0}\n                max={10}\n                icon={Eye}\n                color=\"warning\"\n              />\n            </div>\n          </div>\n        )}\n\n        {/* Advanced Metrics Tab */}\n        {activeTab === 'advanced' && (\n          <div className=\"tab-content\">\n            <div className=\"section-header\">\n              <Activity size={24} />\n              <div>\n                <h3>Advanced Sleep Metrics</h3>\n                <p>Detailed physiological and environmental data</p>\n              </div>\n            </div>\n\n            <div className=\"metrics-categories\">\n              <div className=\"category\">\n                <h4>\n                  <Heart size={18} />\n                  Physiological Metrics\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Heart Rate (BPM)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"65\"\n                      value={advancedMetrics.heartRate}\n                      onChange={(e) => handleAdvancedChange('heartRate', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group\">\n                    <label>SpO₂ (%)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"98\"\n                      value={advancedMetrics.spo2}\n                      onChange={(e) => handleAdvancedChange('spo2', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Body Temperature (°C)</label>\n                    <input\n                      type=\"number\"\n                      step=\"0.1\"\n                      placeholder=\"36.5\"\n                      value={advancedMetrics.bodyTemperature}\n                      onChange={(e) => handleAdvancedChange('bodyTemperature', e.target.value)}\n                    />\n                  </div>\n                </div>\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <Activity size={18} />\n                  Movement & Sound\n                </h4>\n                <div className=\"slider-section\">\n                  <SliderInput\n                    label=\"Motion Level\"\n                    value={parseInt(advancedMetrics.motion) || 5}\n                    onChange={(value) => handleAdvancedChange('motion', value.toString())}\n                    min={0}\n                    max={20}\n                    icon={Activity}\n                    color=\"primary\"\n                  />\n                  <SliderInput\n                    label=\"Snoring Level\"\n                    value={parseInt(advancedMetrics.snoring) || 2}\n                    onChange={(value) => handleAdvancedChange('snoring', value.toString())}\n                    min={0}\n                    max={10}\n                    icon={Volume2}\n                    color=\"warning\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <Thermometer size={18} />\n                  Environmental Conditions\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Room Temperature (°C)</label>\n                    <input\n                      type=\"number\"\n                      step=\"0.1\"\n                      placeholder=\"20\"\n                      value={advancedMetrics.roomTemperature}\n                      onChange={(e) => handleAdvancedChange('roomTemperature', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Humidity (%)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"45\"\n                      value={advancedMetrics.humidity}\n                      onChange={(e) => handleAdvancedChange('humidity', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Noise Level (dB)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"30\"\n                      value={advancedMetrics.noiseLevel}\n                      onChange={(e) => handleAdvancedChange('noiseLevel', e.target.value)}\n                    />\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        )}\n\n        {/* Lifestyle Factors Tab */}\n        {activeTab === 'lifestyle' && (\n          <div className=\"tab-content\">\n            <div className=\"section-header\">\n              <Coffee size={24} />\n              <div>\n                <h3>Lifestyle Factors</h3>\n                <p>Daily habits that affect your sleep quality</p>\n              </div>\n            </div>\n\n            <div className=\"lifestyle-categories\">\n              <div className=\"category\">\n                <h4>\n                  <Utensils size={18} />\n                  Nutrition & Hydration\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Last Meal Time</label>\n                    <input\n                      type=\"time\"\n                      value={lifestyleFactors.lastMealTime}\n                      onChange={(e) => handleLifestyleChange('lastMealTime', e.target.value)}\n                    />\n                  </div>\n                </div>\n                <div className=\"slider-section\">\n                  <SliderInput\n                    label=\"Caffeine Intake (cups)\"\n                    value={lifestyleFactors.caffeineIntake}\n                    onChange={(value) => handleLifestyleChange('caffeineIntake', value)}\n                    min={0}\n                    max={8}\n                    icon={Coffee}\n                    color=\"warning\"\n                  />\n                  <SliderInput\n                    label=\"Alcohol Intake (units)\"\n                    value={lifestyleFactors.alcoholIntake}\n                    onChange={(value) => handleLifestyleChange('alcoholIntake', value)}\n                    min={0}\n                    max={6}\n                    icon={Droplets}\n                    color=\"danger\"\n                  />\n                  <SliderInput\n                    label=\"Water Intake (glasses)\"\n                    value={lifestyleFactors.waterIntake}\n                    onChange={(value) => handleLifestyleChange('waterIntake', value)}\n                    min={0}\n                    max={15}\n                    icon={Droplets}\n                    color=\"primary\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <Dumbbell size={18} />\n                  Exercise & Activity\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Exercise Type</label>\n                    <select\n                      value={lifestyleFactors.exerciseType}\n                      onChange={(e) => handleLifestyleChange('exerciseType', e.target.value)}\n                    >\n                      <option value=\"\">Select exercise type</option>\n                      <option value=\"cardio\">Cardio</option>\n                      <option value=\"strength\">Strength Training</option>\n                      <option value=\"yoga\">Yoga</option>\n                      <option value=\"walking\">Walking</option>\n                      <option value=\"running\">Running</option>\n                      <option value=\"swimming\">Swimming</option>\n                      <option value=\"cycling\">Cycling</option>\n                      <option value=\"other\">Other</option>\n                    </select>\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Exercise Duration (minutes)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"30\"\n                      value={lifestyleFactors.exerciseDuration}\n                      onChange={(e) => handleLifestyleChange('exerciseDuration', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Exercise Time</label>\n                    <input\n                      type=\"time\"\n                      value={lifestyleFactors.exerciseTime}\n                      onChange={(e) => handleLifestyleChange('exerciseTime', e.target.value)}\n                    />\n                  </div>\n                </div>\n                <SliderInput\n                  label=\"Exercise Intensity\"\n                  value={lifestyleFactors.exerciseIntensity}\n                  onChange={(value) => handleLifestyleChange('exerciseIntensity', value)}\n                  min={1}\n                  max={10}\n                  icon={Zap}\n                  color=\"success\"\n                />\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <Smartphone size={18} />\n                  Screen Time & Technology\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Screen Time Before Bed (minutes)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"30\"\n                      value={lifestyleFactors.screenTimeBeforeBed}\n                      onChange={(e) => handleLifestyleChange('screenTimeBeforeBed', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group checkbox-group\">\n                    <label className=\"checkbox-label\">\n                      <input\n                        type=\"checkbox\"\n                        checked={lifestyleFactors.blueLight}\n                        onChange={(e) => handleLifestyleChange('blueLight', e.target.checked)}\n                      />\n                      <span>Used blue light filter</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <Brain size={18} />\n                  Mental Health & Wellness\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Meditation Time (minutes)</label>\n                    <input\n                      type=\"number\"\n                      placeholder=\"10\"\n                      value={lifestyleFactors.meditationTime}\n                      onChange={(e) => handleLifestyleChange('meditationTime', e.target.value)}\n                    />\n                  </div>\n                </div>\n                <div className=\"slider-section\">\n                  <SliderInput\n                    label=\"Stress Level\"\n                    value={lifestyleFactors.stressLevel}\n                    onChange={(value) => handleLifestyleChange('stressLevel', value)}\n                    min={1}\n                    max={10}\n                    icon={Brain}\n                    color=\"danger\"\n                  />\n                  <SliderInput\n                    label=\"Anxiety Level\"\n                    value={lifestyleFactors.anxietyLevel}\n                    onChange={(value) => handleLifestyleChange('anxietyLevel', value)}\n                    min={1}\n                    max={10}\n                    icon={AlertCircle}\n                    color=\"warning\"\n                  />\n                  <SliderInput\n                    label=\"Overall Mood\"\n                    value={lifestyleFactors.moodRating}\n                    onChange={(value) => handleLifestyleChange('moodRating', value)}\n                    min={1}\n                    max={10}\n                    icon={Star}\n                    color=\"success\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <Shield size={18} />\n                  Sleep Environment\n                </h4>\n                <div className=\"slider-section\">\n                  <SliderInput\n                    label=\"Room Darkness\"\n                    value={lifestyleFactors.roomDarkness}\n                    onChange={(value) => handleLifestyleChange('roomDarkness', value)}\n                    min={1}\n                    max={10}\n                    icon={Moon}\n                    color=\"primary\"\n                  />\n                  <SliderInput\n                    label=\"Mattress Comfort\"\n                    value={lifestyleFactors.mattressComfort}\n                    onChange={(value) => handleLifestyleChange('mattressComfort', value)}\n                    min={1}\n                    max={10}\n                    icon={Shield}\n                    color=\"success\"\n                  />\n                  <SliderInput\n                    label=\"Pillow Comfort\"\n                    value={lifestyleFactors.pillowComfort}\n                    onChange={(value) => handleLifestyleChange('pillowComfort', value)}\n                    min={1}\n                    max={10}\n                    icon={Shield}\n                    color=\"success\"\n                  />\n                  <SliderInput\n                    label=\"Noise Disturbance\"\n                    value={lifestyleFactors.noiseDisturbance}\n                    onChange={(value) => handleLifestyleChange('noiseDisturbance', value)}\n                    min={0}\n                    max={10}\n                    icon={Volume2}\n                    color=\"warning\"\n                  />\n                </div>\n              </div>\n            </div>\n          </div>\n        )}\n\n        {/* Goals & Targets Tab */}\n        {activeTab === 'goals' && (\n          <div className=\"tab-content\">\n            <div className=\"section-header\">\n              <Target size={24} />\n              <div>\n                <h3>Sleep Goals & Targets</h3>\n                <p>Set your sleep objectives and track progress</p>\n              </div>\n            </div>\n\n            <div className=\"goals-section\">\n              <div className=\"category\">\n                <h4>\n                  <Clock size={18} />\n                  Sleep Schedule Goals\n                </h4>\n                <div className=\"form-grid\">\n                  <div className=\"form-group\">\n                    <label>Target Sleep Duration</label>\n                    <select\n                      value={goals.targetSleepDuration}\n                      onChange={(e) => handleGoalsChange('targetSleepDuration', e.target.value)}\n                    >\n                      <option value=\"6\">6 hours</option>\n                      <option value=\"6.5\">6.5 hours</option>\n                      <option value=\"7\">7 hours</option>\n                      <option value=\"7.5\">7.5 hours</option>\n                      <option value=\"8\">8 hours</option>\n                      <option value=\"8.5\">8.5 hours</option>\n                      <option value=\"9\">9 hours</option>\n                      <option value=\"9.5\">9.5 hours</option>\n                      <option value=\"10\">10 hours</option>\n                    </select>\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Target Bed Time</label>\n                    <input\n                      type=\"time\"\n                      value={goals.targetBedTime}\n                      onChange={(e) => handleGoalsChange('targetBedTime', e.target.value)}\n                    />\n                  </div>\n                  <div className=\"form-group\">\n                    <label>Target Wake Time</label>\n                    <input\n                      type=\"time\"\n                      value={goals.targetWakeTime}\n                      onChange={(e) => handleGoalsChange('targetWakeTime', e.target.value)}\n                    />\n                  </div>\n                </div>\n              </div>\n\n              <div className=\"category\">\n                <h4>\n                  <TrendingUp size={18} />\n                  Quality & Consistency Goals\n                </h4>\n                <div className=\"slider-section\">\n                  <SliderInput\n                    label=\"Sleep Quality Goal (%)\"\n                    value={goals.sleepQualityGoal}\n                    onChange={(value) => handleGoalsChange('sleepQualityGoal', value)}\n                    min={60}\n                    max={100}\n                    unit=\"%\"\n                    icon={Star}\n                    color=\"success\"\n                  />\n                  <SliderInput\n                    label=\"Consistency Goal (%)\"\n                    value={goals.consistencyGoal}\n                    onChange={(value) => handleGoalsChange('consistencyGoal', value)}\n                    min={70}\n                    max={100}\n                    unit=\"%\"\n                    icon={Target}\n                    color=\"primary\"\n                  />\n                </div>\n              </div>\n\n              <div className=\"current-progress\">\n                <h4>\n                  <Award size={18} />\n                  Current Progress\n                </h4>\n                <div className=\"progress-grid\">\n                  <div className=\"progress-item\">\n                    <div className=\"progress-label\">\n                      <Star size={16} />\n                      <span>Sleep Quality</span>\n                    </div>\n                    <div className=\"progress-bar\">\n                      <div \n                        className=\"progress-fill success\"\n                        style={{ width: `${calculatedMetrics.avgQuality || 0}%` }}\n                      ></div>\n                    </div>\n                    <span className=\"progress-value\">{calculatedMetrics.avgQuality || 0}%</span>\n                  </div>\n                  <div className=\"progress-item\">\n                    <div className=\"progress-label\">\n                      <Target size={16} />\n                      <span>Consistency</span>\n                    </div>\n                    <div className=\"progress-bar\">\n                      <div \n                        className=\"progress-fill primary\"\n                        style={{ width: `${calculatedMetrics.consistencyScore || 0}%` }}\n                      ></div>\n                    </div>\n                    <span className=\"progress-value\">{calculatedMetrics.consistencyScore || 0}%</span>\n                  </div>\n                  <div className=\"progress-item\">\n                    <div className=\"progress-label\">\n                      <Clock size={16} />\n                      <span>Sleep Efficiency</span>\n                    </div>\n                    <div className=\"progress-bar\">\n                      <div \n                        className=\"progress-fill warning\"\n                        style={{ width: `${calculatedMetrics.sleepEfficiency || 0}%` }}\n                      ></div>\n                    </div>\n                    <span className=\"progress-value\">{calculatedMetrics.sleepEfficiency || 0}%</span>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        )}\n\n        {/* Form Actions */}\n        <div className=\"form-actions\">\n          <div className=\"action-buttons\">\n            <button\n              type=\"button\"\n              className=\"btn-secondary\"\n              onClick={resetForm}\n              disabled={isSubmitting}\n            >\n              <RotateCcw size={18} />\n              Reset Form\n            </button>\n            \n            <button\n              type=\"submit\"\n              className=\"btn-primary\"\n              disabled={isSubmitting}\n            >\n              {isSubmitting ? (\n                <>\n                  <div className=\"spinner\"></div>\n                  Processing...\n                </>\n              ) : (\n                <>\n                  <Save size={18} />\n                  Save All Data\n                </>\n              )}\n            </button>\n          </div>\n\n          {submitStatus && (\n            <div className={`submit-status ${submitStatus.type}`}>\n              {submitStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}\n              <span>{submitStatus.message}</span>\n            </div>\n          )}\n        </div>\n      </form>\n\n      {/* Recommendations Panel */}\n      {showRecommendations && recommendations.length > 0 && (\n        <div className=\"recommendations-panel\">\n          <div className=\"panel-header\">\n            <Lightbulb size={24} />\n            <div>\n              <h3>Personalized Recommendations</h3>\n              <p>Based on your current data and goals</p>\n            </div>\n            <button \n              className=\"close-panel\"\n              onClick={() => setShowRecommendations(false)}\n            >\n              ×\n            </button>\n          </div>\n          <div className=\"recommendations-grid\">\n            {recommendations.slice(0, 6).map((rec, index) => (\n              <div key={index} className={`recommendation-card ${rec.priority}`}>\n                <div className=\"rec-icon\">{rec.icon}</div>\n                <div className=\"rec-content\">\n                  <h4>{rec.title}</h4>\n                  <p>{rec.description}</p>\n                </div>\n                <div className={`priority-badge ${rec.priority}`}>\n                  {rec.priority}\n                </div>\n              </div>\n            ))}\n          </div>\n        </div>\n      )}\n    </div>\n  );\n};\n\nexport default InteractiveDataInput;\n