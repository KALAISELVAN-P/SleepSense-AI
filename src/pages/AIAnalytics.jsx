import { useState } from 'react';
import { Brain, TrendingUp, Target, RefreshCw } from 'lucide-react';

const AIAnalytics = () => {
  const [modelStats, setModelStats] = useState({
    confidence: 87,
    accuracy: 92,
    f1Score: 0.89,
    lastTrained: '2024-01-10',
    dataPoints: 1247
  });

  const [retraining, setRetraining] = useState(false);

  const predictions = [
    {
      date: '2024-01-16',
      predicted: 'Normal Sleep',
      confidence: 94,
      actual: 'Normal Sleep',
      accuracy: 'Correct'
    },
    {
      date: '2024-01-15',
      predicted: 'Restless Sleep',
      confidence: 78,
      actual: 'Restless Sleep',
      accuracy: 'Correct'
    },
    {
      date: '2024-01-14',
      predicted: 'Normal Sleep',
      confidence: 85,
      actual: 'Apnea Detected',
      accuracy: 'Incorrect'
    }
  ];

  const insights = [
    {
      title: 'Sleep Pattern Recognition',
      description: 'Model identifies 4 distinct sleep patterns with 92% accuracy',
      confidence: 92
    },
    {
      title: 'Apnea Detection',
      description: 'Early detection of sleep apnea events with 89% sensitivity',
      confidence: 89
    },
    {
      title: 'Quality Prediction',
      description: 'Predicts next night sleep quality based on lifestyle factors',
      confidence: 85
    }
  ];

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => {
      setModelStats(prev => ({
        ...prev,
        accuracy: Math.min(95, prev.accuracy + Math.random() * 3),
        confidence: Math.min(95, prev.confidence + Math.random() * 5),
        f1Score: Math.min(0.95, prev.f1Score + Math.random() * 0.05),
        lastTrained: new Date().toISOString().split('T')[0],
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 50)
      }));
      setRetraining(false);
    }, 3000);
  };

  return (
    <div className="ai-analytics">
      <h1>AI Model Analytics</h1>

      <div className="model-performance">
        <h3>Model Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <Brain className="icon" />
            <h4>Model Confidence</h4>
            <div className="metric-value">{modelStats.confidence}%</div>
            <div className="metric-bar">
              <div 
                className="metric-fill" 
                style={{ width: `${modelStats.confidence}%` }}
              ></div>
            </div>
          </div>

          <div className="metric-card">
            <Target className="icon" />
            <h4>Accuracy</h4>
            <div className="metric-value">{modelStats.accuracy}%</div>
            <div className="metric-bar">
              <div 
                className="metric-fill" 
                style={{ width: `${modelStats.accuracy}%` }}
              ></div>
            </div>
          </div>

          <div className="metric-card">
            <TrendingUp className="icon" />
            <h4>F1 Score</h4>
            <div className="metric-value">{modelStats.f1Score}</div>
            <div className="metric-bar">
              <div 
                className="metric-fill" 
                style={{ width: `${modelStats.f1Score * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="model-info">
          <div className="info-item">
            <span>Last Trained:</span>
            <span>{modelStats.lastTrained}</span>
          </div>
          <div className="info-item">
            <span>Training Data Points:</span>
            <span>{modelStats.dataPoints.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="predictive-insights">
        <h3>Predictive Insights</h3>
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
              <div className="confidence-badge">
                Confidence: {insight.confidence}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="prediction-history">
        <h3>Recent Predictions vs Actual</h3>
        <div className="predictions-table">
          <div className="table-header">
            <span>Date</span>
            <span>Predicted</span>
            <span>Confidence</span>
            <span>Actual</span>
            <span>Result</span>
          </div>
          {predictions.map((pred, index) => (
            <div key={index} className="table-row">
              <span>{pred.date}</span>
              <span>{pred.predicted}</span>
              <span>{pred.confidence}%</span>
              <span>{pred.actual}</span>
              <span className={`result ${pred.accuracy.toLowerCase()}`}>
                {pred.accuracy}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="model-actions">
        <button 
          className={`retrain-btn ${retraining ? 'loading' : ''}`}
          onClick={handleRetrain}
          disabled={retraining}
        >
          <RefreshCw className={retraining ? 'spinning' : ''} />
          {retraining ? 'Retraining Model...' : 'Retrain Model with New Data'}
        </button>
        <p className="retrain-info">
          Retraining will improve model accuracy using your latest sleep data
        </p>
      </div>
    </div>
  );
};

export default AIAnalytics;