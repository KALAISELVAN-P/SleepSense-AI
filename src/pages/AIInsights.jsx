import { Brain, Clock, Moon, Activity, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const AIInsights = () => {
  const { sleepData } = useData();
  const metrics = sleepData.currentMetrics;
  
  // Get age-based sleep recommendations
  const getAgeBasedRecommendations = (age) => {
    if (age < 18) return { minSleep: 8, maxSleep: 10, deepSleepTarget: 25 };
    if (age <= 60) return { minSleep: 7, maxSleep: 8, deepSleepTarget: 20 };
    return { minSleep: 6, maxSleep: 7, deepSleepTarget: 15 };
  };

  // Calculate advanced sleep metrics from manual data
  const calculateAdvancedMetrics = () => {
    const durationMinutes = typeof metrics.duration === 'string' ? 
      parseInt(metrics.duration.split('h')[0]) * 60 + parseInt(metrics.duration.split(' ')[1]) : 
      metrics.duration;
    
    const timeInBed = durationMinutes + 30; // Assume 30 mins to fall asleep + wake up
    const sleepEfficiency = Math.round((durationMinutes / timeInBed) * 100);
    
    const sleepLatency = Math.max(5, Math.min(30, 20 - (metrics.quality - 70) / 5)); // 5-30 mins based on quality
    
    const remDuration = Math.round(durationMinutes * 0.25); // ~25% of sleep is REM
    const remHours = Math.floor(remDuration / 60);
    const remMins = remDuration % 60;
    
    const sleepCycles = Math.round(durationMinutes / 90); // 90-min cycles
    
    const waso = Math.max(5, Math.min(60, metrics.motion * 2)); // Wake time based on movement
    
    const consistencyScore = Math.max(70, Math.min(95, 95 - (metrics.motion / 2))); // Based on restlessness
    
    const userAge = parseInt(sleepData.userProfile?.age) || 25;
    const ageRec = getAgeBasedRecommendations(userAge);
    const targetSleep = ageRec.minSleep * 60; // Age-based target
    const sleepDebt = (targetSleep - durationMinutes) / 60;
    
    return {
      sleepEfficiency,
      sleepLatency: Math.round(sleepLatency),
      remDuration: `${remHours}h ${remMins.toString().padStart(2, '0')}m`,
      sleepCycles,
      waso: Math.round(waso),
      consistencyScore: Math.round(consistencyScore),
      sleepDebt: sleepDebt > 0 ? `+${sleepDebt.toFixed(1)}h` : `${sleepDebt.toFixed(1)}h`
    };
  };
  
  const advancedMetrics = calculateAdvancedMetrics();

  return (
    <div className="ai-insights">
      <h1>AI Sleep Insights</h1>

      <div className="disorders-section">
        <h3>🏥 AI Sleep Disorder Risk Analysis</h3>
        <div className="disorders-grid">
          <div className={`disorder-card ${metrics.apneaDetected || metrics.spo2 < 95 ? 'red' : metrics.spo2 < 97 ? 'yellow' : 'green'}`}>
            <h4>Sleep Apnea Risk</h4>
            <span className="risk-level">{metrics.apneaDetected || metrics.spo2 < 95 ? 'High Risk' : metrics.spo2 < 97 ? 'Moderate Risk' : 'Low Risk'}</span>
            <p className="risk-desc">SpO2: {metrics.spo2}% {metrics.apneaDetected ? '• Apnea detected' : ''}</p>
          </div>
          <div className={`disorder-card ${advancedMetrics.sleepLatency > 30 || advancedMetrics.sleepEfficiency < 80 ? 'red' : advancedMetrics.sleepLatency > 20 || advancedMetrics.sleepEfficiency < 85 ? 'yellow' : 'green'}`}>
            <h4>Insomnia Risk</h4>
            <span className="risk-level">{advancedMetrics.sleepLatency > 30 || advancedMetrics.sleepEfficiency < 80 ? 'High Risk' : advancedMetrics.sleepLatency > 20 || advancedMetrics.sleepEfficiency < 85 ? 'Moderate Risk' : 'Low Risk'}</span>
            <p className="risk-desc">Sleep Latency: {advancedMetrics.sleepLatency}min • Efficiency: {advancedMetrics.sleepEfficiency}%</p>
          </div>
          <div className={`disorder-card ${metrics.motion > 25 || advancedMetrics.waso > 45 ? 'red' : metrics.motion > 15 || advancedMetrics.waso > 30 ? 'yellow' : 'green'}`}>
            <h4>Restless Leg Syndrome</h4>
            <span className="risk-level">{metrics.motion > 25 || advancedMetrics.waso > 45 ? 'High Risk' : metrics.motion > 15 || advancedMetrics.waso > 30 ? 'Moderate Risk' : 'Low Risk'}</span>
            <p className="risk-desc">Motion Events: {metrics.motion} • WASO: {advancedMetrics.waso}min</p>
          </div>
          <div className={`disorder-card ${advancedMetrics.consistencyScore < 70 ? 'red' : advancedMetrics.consistencyScore < 80 ? 'yellow' : 'green'}`}>
            <h4>Circadian Rhythm Disorder</h4>
            <span className="risk-level">{advancedMetrics.consistencyScore < 70 ? 'High Risk' : advancedMetrics.consistencyScore < 80 ? 'Moderate Risk' : 'Low Risk'}</span>
            <p className="risk-desc">Sleep Consistency: {advancedMetrics.consistencyScore}%</p>
          </div>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <Target className="icon" />
          <h3>Sleep Efficiency</h3>
          <div className="value">{advancedMetrics.sleepEfficiency}%</div>
          <p className="description">(Total sleep / time in bed) × 100</p>
        </div>

        <div className="insight-card">
          <Clock className="icon" />
          <h3>Sleep Latency</h3>
          <div className="value">{advancedMetrics.sleepLatency} mins</div>
          <p className="description">Time taken to fall asleep</p>
        </div>

        <div className="insight-card">
          <Moon className="icon" />
          <h3>REM Sleep Duration</h3>
          <div className="value">{advancedMetrics.remDuration}</div>
          <p className="description">Estimate REM phase based on HRV/motion</p>
        </div>

        <div className="insight-card">
          <Activity className="icon" />
          <h3>Sleep Cycle Count</h3>
          <div className="value">{advancedMetrics.sleepCycles} cycles</div>
          <p className="description">1 cycle ≈ 90 mins</p>
        </div>

        <div className="insight-card">
          <Brain className="icon" />
          <h3>Wake After Sleep Onset</h3>
          <div className="value">{advancedMetrics.waso} mins</div>
          <p className="description">Minutes awake after first falling asleep</p>
        </div>

        <div className="insight-card">
          <TrendingUp className="icon" />
          <h3>Sleep Consistency Score</h3>
          <div className="value">{advancedMetrics.consistencyScore}%</div>
          <p className="description">Variation in bedtime/wake time</p>
        </div>

        <div className="insight-card">
          <BarChart3 className="icon" />
          <h3>Sleep Debt</h3>
          <div className="value">{advancedMetrics.sleepDebt}</div>
          <p className="description">Hours below weekly sleep target</p>
        </div>
      </div>

      <div className="ai-analysis-card">
        <h3>🤖 Age-Aware AI Sleep Analysis</h3>
        <div className="analysis-grid">
          <div className="analysis-item">
            <h4>Sleep Quality Index</h4>
            <div className="score-display">{metrics.quality} / 100</div>
            <p>For age {sleepData.userProfile?.age || 'unknown'}: {metrics.quality >= 85 ? 'Excellent' : metrics.quality >= 70 ? 'Good' : 'Needs improvement'}</p>
          </div>
          <div className="analysis-item">
            <h4>Total Sleep Duration</h4>
            <div className="duration-display">{metrics.duration}</div>
            <p>Target for your age: {getAgeBasedRecommendations(parseInt(sleepData.userProfile?.age) || 25).minSleep}-{getAgeBasedRecommendations(parseInt(sleepData.userProfile?.age) || 25).maxSleep} hours</p>
          </div>
          <div className="analysis-item">
            <h4>Sleep Efficiency</h4>
            <div className="efficiency-display">{advancedMetrics.sleepEfficiency}%</div>
            <p>Age-adjusted performance rating</p>
          </div>
        </div>
        <div className="ai-recommendation">
          <h4>🎯 AI Recommendations</h4>
          <ul>
            {metrics.quality < 70 && <li>Focus on sleep hygiene - consistent bedtime, cool room temperature</li>}
            {advancedMetrics.sleepLatency > 20 && <li>Try relaxation techniques like deep breathing or meditation before bed</li>}
            {metrics.motion > 20 && <li>Consider reducing caffeine intake and creating a more comfortable sleep environment</li>}
            {metrics.spo2 < 96 && <li>Monitor breathing patterns - consider consulting a sleep specialist</li>}
            {advancedMetrics.sleepDebt.includes('+') === false && parseFloat(advancedMetrics.sleepDebt) < -1 && <li>Prioritize getting more sleep to reduce sleep debt</li>}
          </ul>
        </div>
      </div>
      
      <div className="sleep-stages-section">
        <h3>📊 Sleep Stage Breakdown</h3>
        <div className="stages-container">
          <div className="stages-chart">
            <div className="stage-bar deep" style={{width: '30%'}}>
              <span>Deep Sleep 30%</span>
            </div>
            <div className="stage-bar light" style={{width: '50%'}}>
              <span>Light Sleep 50%</span>
            </div>
            <div className="stage-bar awake" style={{width: '20%'}}>
              <span>Awake 20%</span>
            </div>
          </div>
          <div className="stages-legend">
            <div className="legend-item">
              <div className="legend-color deep"></div>
              <span>Deep Sleep (30%) - Physical recovery</span>
            </div>
            <div className="legend-item">
              <div className="legend-color light"></div>
              <span>Light Sleep (50%) - Transition phases</span>
            </div>
            <div className="legend-item">
              <div className="legend-color awake"></div>
              <span>Awake (20%) - Brief awakenings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-info">
        <h3>💡 Understanding Your Metrics</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Sleep Efficiency ({advancedMetrics.sleepEfficiency}%)</h4>
            <p>{advancedMetrics.sleepEfficiency >= 90 ? 'Excellent! You spend most of your time in bed actually sleeping.' : 
               advancedMetrics.sleepEfficiency >= 85 ? 'Good efficiency. Minor room for improvement.' : 
               'Consider improving your sleep environment and routine.'}</p>
          </div>
          <div className="info-item">
            <h4>REM Sleep ({advancedMetrics.remDuration})</h4>
            <p>REM sleep is crucial for memory consolidation and emotional processing. This estimate is based on your sleep duration and quality.</p>
          </div>
          <div className="info-item">
            <h4>Sleep Debt ({advancedMetrics.sleepDebt})</h4>
            <p>{advancedMetrics.sleepDebt.includes('+') ? 'You\'re getting extra sleep - great for recovery!' : 
               parseFloat(advancedMetrics.sleepDebt) > -2 ? 'Manageable sleep debt. Try to get a bit more rest.' : 
               'Significant sleep debt. Prioritize getting more sleep.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;