import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [sleepData, setSleepData] = useState({
    // Current sleep metrics
    currentMetrics: {
      quality: 85,
      duration: '7h 32m',
      type: 'Normal',
      heartRate: 65,
      spo2: 98,
      motion: 12,
      snoring: 3,
      deepSleep: '2h 15m',
      apneaDetected: false,
      restlessEvents: 3
    },
    
    // Historical data for charts and trends
    dailyData: [
      { date: '2024-01-15', quality: 85, heartRate: 65, spo2: 98, motion: 12, snoring: 3, duration: 452, deepSleep: 135, apnea: false },
      { date: '2024-01-14', quality: 72, heartRate: 68, spo2: 97, motion: 15, snoring: 5, duration: 405, deepSleep: 98, apnea: false },
      { date: '2024-01-13', quality: 92, heartRate: 62, spo2: 96, motion: 8, snoring: 2, duration: 495, deepSleep: 165, apnea: false },
      { date: '2024-01-12', quality: 68, heartRate: 70, spo2: 95, motion: 18, snoring: 7, duration: 422, deepSleep: 89, apnea: true },
      { date: '2024-01-11', quality: 88, heartRate: 64, spo2: 97, motion: 10, snoring: 4, duration: 468, deepSleep: 142, apnea: false },
      { date: '2024-01-10', quality: 76, heartRate: 66, spo2: 96, motion: 14, snoring: 6, duration: 418, deepSleep: 105, apnea: false },
      { date: '2024-01-09', quality: 94, heartRate: 61, spo2: 98, motion: 6, snoring: 1, duration: 502, deepSleep: 178, apnea: false }
    ],
    
    // Lifestyle data
    lifestyleData: [
      { date: '2024-01-15', caffeine: 2, screenTime: 6, exercise: 30, bedtime: '22:30', wakeTime: '06:30' },
      { date: '2024-01-14', caffeine: 3, screenTime: 8, exercise: 0, bedtime: '23:15', wakeTime: '07:00' },
      { date: '2024-01-13', caffeine: 1, screenTime: 4, exercise: 45, bedtime: '22:00', wakeTime: '06:15' }
    ],
    
    // AI insights and recommendations
    aiInsights: {
      summary: 'Your deep sleep improved by 12% last night.',
      disorders: [
        { name: 'Sleep Apnea', risk: 'Low', color: 'green' },
        { name: 'Insomnia', risk: 'Medium', color: 'yellow' },
        { name: 'Restless Leg', risk: 'Low', color: 'green' }
      ],
      recommendations: [
        { title: 'Optimal Sleep Time', description: 'Go to bed at 10:30 PM for 8 hours of quality sleep', priority: 'high' },
        { title: 'Avoid Caffeine', description: 'Stop caffeine intake after 6 PM to improve deep sleep', priority: 'medium' },
        { title: 'Breathing Exercise', description: 'Try 4-7-8 breathing technique before bed', priority: 'low' }
      ]
    },
    
    // Calendar data
    calendarData: {
      '2024-01-15': { quality: 85, type: 'Normal', duration: '7h 32m' },
      '2024-01-14': { quality: 72, type: 'Restless', duration: '6h 45m' },
      '2024-01-13': { quality: 92, type: 'Normal', duration: '8h 15m' },
      '2024-01-12': { quality: 68, type: 'Apnea', duration: '7h 02m' },
      '2024-01-11': { quality: 88, type: 'Normal', duration: '7h 48m' },
      '2024-01-10': { quality: 76, type: 'Restless', duration: '6h 58m' },
      '2024-01-09': { quality: 94, type: 'Normal', duration: '8h 22m' }
    }
  });

  // Load user-specific data from localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const savedData = localStorage.getItem(`sleepData_${user.email}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setSleepData(parsedData);
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    }
  }, []);

  // Save user-specific data to localStorage whenever it changes
  useEffect(() => {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      localStorage.setItem(`sleepData_${user.email}`, JSON.stringify(sleepData));
      // Also save as current data for easy access
      localStorage.setItem('currentSleepData', JSON.stringify(sleepData));
    }
  }, [sleepData]);

  // Function to process and import data from uploaded file
  const importData = (fileData, fileType) => {
    try {
      let parsedData;
      
      if (fileType === 'json') {
        parsedData = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
      } else if (fileType === 'csv') {
        parsedData = parseCSVData(fileData);
      } else {
        throw new Error('Unsupported file type');
      }

      // Process and update all data
      const updatedData = processImportedData(parsedData);
      setSleepData(updatedData);
      
      return { success: true, message: 'Data imported successfully!' };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, message: `Error importing data: ${error.message}` };
    }
  };

  // Function to parse CSV data
  const parseCSVData = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to convert to number if possible
        row[header] = isNaN(value) ? value : parseFloat(value);
      });
      return row;
    });

    return data;
  };

  // Function to process imported data and update all contexts
  const processImportedData = (importedData) => {
    const newData = { ...sleepData };

    // If it's an array (CSV or JSON array), process each record
    if (Array.isArray(importedData)) {
      importedData.forEach(record => {
        updateDataFromRecord(newData, record);
      });
    } else if (typeof importedData === 'object') {
      // If it's a single object, process it
      updateDataFromRecord(newData, importedData);
    }

    // Update current metrics with latest data
    if (newData.dailyData.length > 0) {
      const latestData = newData.dailyData[newData.dailyData.length - 1];
      newData.currentMetrics = {
        quality: latestData.quality,
        duration: formatDuration(latestData.duration),
        type: determineSleeType(latestData),
        heartRate: latestData.heartRate,
        spo2: latestData.spo2,
        motion: latestData.motion,
        snoring: latestData.snoring,
        deepSleep: formatDuration(latestData.deepSleep),
        apneaDetected: latestData.apnea,
        restlessEvents: Math.floor(latestData.motion / 5)
      };
    }

    // Update AI insights based on new data
    newData.aiInsights = generateAIInsights(newData.dailyData);

    return newData;
  };

  // Helper function to update data from a single record
  const updateDataFromRecord = (data, record) => {
    const date = record.date || new Date().toISOString().split('T')[0];
    
    // Update daily data
    const existingIndex = data.dailyData.findIndex(d => d.date === date);
    const newRecord = {
      date,
      quality: record.sleepQuality || record.quality || 75,
      heartRate: record.heartRate || record.bpm || 65,
      spo2: record.spo2 || record.oxygenSaturation || 98,
      motion: record.motion || record.movement || 10,
      snoring: record.snoring || record.snoreLevel || 3,
      duration: record.duration || record.sleepDuration || 420,
      deepSleep: record.deepSleep || record.deepSleepDuration || 120,
      apnea: record.apnea || record.apneaDetected || false
    };

    if (existingIndex >= 0) {
      data.dailyData[existingIndex] = newRecord;
    } else {
      data.dailyData.push(newRecord);
    }

    // Sort by date
    data.dailyData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Update calendar data
    data.calendarData[date] = {
      quality: newRecord.quality,
      type: determineSleeType(newRecord),
      duration: formatDuration(newRecord.duration)
    };

    // Update lifestyle data if available
    if (record.caffeine || record.screenTime || record.exercise) {
      const lifestyleRecord = {
        date,
        caffeine: record.caffeine || 0,
        screenTime: record.screenTime || 0,
        exercise: record.exercise || 0,
        bedtime: record.bedtime || '22:30',
        wakeTime: record.wakeTime || '06:30'
      };

      const lifestyleIndex = data.lifestyleData.findIndex(d => d.date === date);
      if (lifestyleIndex >= 0) {
        data.lifestyleData[lifestyleIndex] = lifestyleRecord;
      } else {
        data.lifestyleData.push(lifestyleRecord);
      }
    }
  };

  // Helper function to determine sleep type
  const determineSleeType = (record) => {
    if (record.apnea) return 'Apnea';
    if (record.quality < 60) return 'Poor';
    if (record.motion > 15) return 'Restless';
    if (record.quality < 70) return 'Light';
    return 'Normal';
  };

  // Helper function to format duration
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Helper function to generate AI insights
  const generateAIInsights = (dailyData) => {
    if (dailyData.length === 0) return sleepData.aiInsights;

    const recent = dailyData.slice(-7); // Last 7 days
    const avgQuality = recent.reduce((sum, d) => sum + d.quality, 0) / recent.length;
    const apneaCount = recent.filter(d => d.apnea).length;
    const avgDeepSleep = recent.reduce((sum, d) => sum + d.deepSleep, 0) / recent.length;

    return {
      summary: `Your average sleep quality is ${Math.round(avgQuality)}%. ${
        avgQuality > 80 ? 'Excellent work!' : 
        avgQuality > 70 ? 'Good progress, keep it up!' : 
        'Consider improving your sleep habits.'
      }`,
      disorders: [
        { name: 'Sleep Apnea', risk: apneaCount > 2 ? 'High' : apneaCount > 0 ? 'Medium' : 'Low', color: apneaCount > 2 ? 'red' : apneaCount > 0 ? 'yellow' : 'green' },
        { name: 'Insomnia', risk: avgQuality < 60 ? 'High' : avgQuality < 75 ? 'Medium' : 'Low', color: avgQuality < 60 ? 'red' : avgQuality < 75 ? 'yellow' : 'green' },
        { name: 'Deep Sleep Deficiency', risk: avgDeepSleep < 90 ? 'High' : avgDeepSleep < 120 ? 'Medium' : 'Low', color: avgDeepSleep < 90 ? 'red' : avgDeepSleep < 120 ? 'yellow' : 'green' }
      ],
      recommendations: [
        { title: 'Sleep Schedule', description: 'Maintain consistent bedtime and wake time', priority: 'high' },
        { title: 'Sleep Environment', description: 'Keep bedroom cool, dark, and quiet', priority: 'medium' },
        { title: 'Pre-sleep Routine', description: 'Avoid screens 1 hour before bed', priority: 'medium' }
      ]
    };
  };

  // Function to manually update metrics (for manual input) - FULLY REACTIVE
  const updateManualMetrics = (newMetrics) => {
    setSleepData(prev => {
      const updatedMetrics = {
        ...prev.currentMetrics,
        ...newMetrics
      };
      
      // Update today's data in dailyData
      const today = new Date().toISOString().split('T')[0];
      const updatedDailyData = [...prev.dailyData];
      const todayIndex = updatedDailyData.findIndex(d => d.date === today);
      
      const todayRecord = {
        date: today,
        quality: updatedMetrics.quality,
        heartRate: updatedMetrics.heartRate,
        spo2: updatedMetrics.spo2,
        motion: updatedMetrics.motion,
        snoring: updatedMetrics.snoring,
        duration: parseDuration(updatedMetrics.duration),
        deepSleep: parseDuration(updatedMetrics.deepSleep),
        apnea: updatedMetrics.apneaDetected
      };
      
      if (todayIndex >= 0) {
        updatedDailyData[todayIndex] = todayRecord;
      } else {
        updatedDailyData.push(todayRecord);
      }
      
      // Update calendar data
      const updatedCalendarData = {
        ...prev.calendarData,
        [today]: {
          quality: updatedMetrics.quality,
          type: determineSleeType(todayRecord),
          duration: updatedMetrics.duration
        }
      };
      
      // Update lifestyle data if exists
      const updatedLifestyleData = [...prev.lifestyleData];
      const lifestyleIndex = updatedLifestyleData.findIndex(d => d.date === today);
      if (lifestyleIndex >= 0) {
        updatedLifestyleData[lifestyleIndex] = {
          ...updatedLifestyleData[lifestyleIndex],
          updatedAt: new Date().toISOString()
        };
      }
      
      // Regenerate AI insights with updated data
      const updatedAIInsights = generateAIInsights(updatedDailyData);
      
      const newData = {
        ...prev,
        currentMetrics: updatedMetrics,
        dailyData: updatedDailyData,
        calendarData: updatedCalendarData,
        lifestyleData: updatedLifestyleData,
        aiInsights: updatedAIInsights,
        lastUpdated: new Date().toISOString()
      };
      
      // Trigger update event for all components
      window.dispatchEvent(new CustomEvent('sleepDataUpdated', { detail: newData }));
      
      return newData;
    });
  };

  // Function to get current data for reports
  const getCurrentDataForReport = () => {
    return {
      ...sleepData,
      exportedAt: new Date().toISOString(),
      userEmail: JSON.parse(localStorage.getItem('user') || '{}').email
    };
  };
  
  // Helper to parse duration string to minutes
  const parseDuration = (durationStr) => {
    if (typeof durationStr === 'number') return durationStr;
    const match = durationStr.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 420; // Default 7 hours
  };

  // Function to add lifestyle entry
  const addLifestyleEntry = (entry) => {
    setSleepData(prev => {
      const newLifestyleData = [...prev.lifestyleData];
      const existingIndex = newLifestyleData.findIndex(d => d.date === entry.date);
      
      if (existingIndex >= 0) {
        newLifestyleData[existingIndex] = entry;
      } else {
        newLifestyleData.push(entry);
      }

      return {
        ...prev,
        lifestyleData: newLifestyleData
      };
    });
  };

  // Calculate advanced metrics in real-time
  const getCalculatedMetrics = () => {
    const recent = sleepData.dailyData.slice(-7);
    if (recent.length === 0) return {};
    
    const avgDuration = recent.reduce((sum, d) => sum + d.duration, 0) / recent.length;
    const avgQuality = recent.reduce((sum, d) => sum + d.quality, 0) / recent.length;
    const avgDeepSleep = recent.reduce((sum, d) => sum + d.deepSleep, 0) / recent.length;
    const avgHeartRate = recent.reduce((sum, d) => sum + d.heartRate, 0) / recent.length;
    
    return {
      sleepEfficiency: Math.round((avgDeepSleep / avgDuration) * 100),
      sleepLatency: Math.round(15 - (avgQuality / 10)), // Estimated
      remDuration: Math.round(avgDuration * 0.25), // ~25% of sleep
      sleepCycles: Math.round(avgDuration / 90), // 90min cycles
      waso: Math.round((100 - avgQuality) / 10), // Wake after sleep onset
      consistencyScore: Math.round(100 - (recent.reduce((sum, d, i) => {
        if (i === 0) return sum;
        return sum + Math.abs(d.duration - recent[i-1].duration);
      }, 0) / recent.length)),
      sleepDebt: Math.max(0, Math.round((480 - avgDuration) * recent.length / 60)), // Hours
      avgHeartRate: Math.round(avgHeartRate),
      weeklyTrend: recent.length > 1 ? (recent[recent.length-1].quality - recent[0].quality) : 0
    };
  };

  // Get personalized recommendations based on current data
  const getPersonalizedRecommendations = () => {
    const metrics = getCalculatedMetrics();
    const recommendations = [];
    
    if (metrics.sleepEfficiency < 85) {
      recommendations.push({
        title: 'Improve Sleep Efficiency',
        description: `Your sleep efficiency is ${metrics.sleepEfficiency}%. Try reducing screen time before bed.`,
        priority: 'high',
        icon: '⚡'
      });
    }
    
    if (metrics.consistencyScore < 70) {
      recommendations.push({
        title: 'Maintain Sleep Schedule',
        description: 'Go to bed and wake up at the same time daily to improve consistency.',
        priority: 'high',
        icon: '⏰'
      });
    }
    
    if (metrics.sleepDebt > 2) {
      recommendations.push({
        title: 'Address Sleep Debt',
        description: `You have ${metrics.sleepDebt} hours of sleep debt. Consider earlier bedtime.`,
        priority: 'medium',
        icon: '💤'
      });
    }
    
    return recommendations;
  };

  const contextValue = {
    sleepData,
    setSleepData,
    importData,
    updateManualMetrics,
    addLifestyleEntry,
    getCurrentDataForReport,
    getCalculatedMetrics,
    getPersonalizedRecommendations
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};