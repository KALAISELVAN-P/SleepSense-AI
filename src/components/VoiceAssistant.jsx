import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VoiceAssistant = () => {
  const { sleepData } = useData();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;
  }, []);

  const speak = (text) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const handleVoiceCommand = (command) => {
    const { updateManualMetrics } = useData();
    const metrics = sleepData.currentMetrics;
    
    // Navigation commands
    if (command.includes('go to') || command.includes('open') || command.includes('show')) {
      if (command.includes('dashboard') || command.includes('home')) {
        navigate('/dashboard');
        speak('Opening your sleep dashboard.');
      }
      else if (command.includes('ai insights') || command.includes('insights')) {
        navigate('/ai-insights');
        speak('Opening AI sleep insights.');
      }
      else if (command.includes('graphs') || command.includes('charts')) {
        navigate('/graphs');
        speak('Opening sleep trend graphs.');
      }
      else if (command.includes('lifestyle')) {
        navigate('/lifestyle');
        speak('Opening lifestyle tracker.');
      }
      else if (command.includes('sleep plan') || command.includes('plan')) {
        navigate('/sleep-plan');
        speak('Opening your sleep plan.');
      }
      else if (command.includes('reports')) {
        navigate('/reports');
        speak('Opening sleep reports.');
      }
      else if (command.includes('sounds') || command.includes('music')) {
        navigate('/sleep-sounds');
        speak('Opening sleep sounds.');
      }
      else if (command.includes('calendar') || command.includes('alarm')) {
        navigate('/calendar');
        speak('Opening calendar and alarm.');
      }
      else if (command.includes('game') || command.includes('animal')) {
        navigate('/sleep-game');
        speak('Opening sleep animal challenge.');
      }
      else if (command.includes('settings')) {
        navigate('/settings');
        speak('Opening settings.');
      }
    }
    
    // Data input commands
    else if (command.includes('set') || command.includes('update') || command.includes('record')) {
      const numbers = command.match(/\d+/g);
      if (command.includes('heart rate') && numbers) {
        updateManualMetrics({ heartRate: parseInt(numbers[0]) });
        speak(`Heart rate updated to ${numbers[0]} beats per minute.`);
      }
      else if (command.includes('sleep quality') && numbers) {
        updateManualMetrics({ quality: parseInt(numbers[0]) });
        speak(`Sleep quality updated to ${numbers[0]} percent.`);
      }
      else if (command.includes('oxygen') && numbers) {
        updateManualMetrics({ spo2: parseInt(numbers[0]) });
        speak(`Oxygen saturation updated to ${numbers[0]} percent.`);
      }
      else if (command.includes('motion') && numbers) {
        updateManualMetrics({ motion: parseInt(numbers[0]) });
        speak(`Motion level updated to ${numbers[0]}.`);
      }
      else if (command.includes('snoring') && numbers) {
        updateManualMetrics({ snoring: parseInt(numbers[0]) });
        speak(`Snoring level updated to ${numbers[0]} out of 10.`);
      }
      else if (command.includes('alarm') && numbers) {
        const hour = parseInt(numbers[0]);
        const minute = numbers[1] ? parseInt(numbers[1]) : 0;
        localStorage.setItem('voiceAlarm', JSON.stringify({ hour, minute, enabled: true }));
        speak(`Alarm set for ${hour}:${minute.toString().padStart(2, '0')}.`);
      }
    }
    
    // Sleep analysis commands
    else if (command.includes('how') || command.includes('what')) {
      if (command.includes('sleep') && (command.includes('last night') || command.includes('today'))) {
        const quality = metrics.quality >= 80 ? 'excellent' : metrics.quality >= 70 ? 'good' : 'poor';
        speak(`Your sleep was ${quality} with ${metrics.quality}% quality. Duration: ${metrics.duration}. Heart rate: ${metrics.heartRate} BPM.`);
      }
      else if (command.includes('heart rate')) {
        speak(`Your current heart rate is ${metrics.heartRate} beats per minute.`);
      }
      else if (command.includes('sleep score') || command.includes('quality')) {
        speak(`Your sleep quality score is ${metrics.quality} percent.`);
      }
      else if (command.includes('animal') || command.includes('level')) {
        const animal = metrics.quality > 90 ? 'Kaniska' : metrics.quality > 75 ? 'Lathika' : metrics.quality > 50 ? 'Panda' : 'Elephant';
        speak(`You are currently a sleep ${animal} with ${metrics.quality}% quality.`);
      }
    }
    
    // Sleep sounds commands
    else if (command.includes('play')) {
      navigate('/sleep-sounds');
      if (command.includes('rain')) speak('Playing rain sounds.');
      else if (command.includes('piano')) speak('Playing piano melody.');
      else if (command.includes('tamil') || command.includes('lullaby')) speak('Playing Tamil lullaby.');
      else speak('Opening sleep sounds. Choose your preferred sound.');
    }
    
    // Tips and recommendations
    else if (command.includes('tip') || command.includes('advice') || command.includes('help')) {
      const tips = [
        'Go to bed at the same time every night to improve sleep consistency.',
        'Keep your bedroom temperature between 65 to 68 degrees.',
        'Avoid caffeine 6 hours before bedtime.',
        'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.',
        'Use blackout curtains to create a dark sleep environment.',
        'Put away electronic devices 1 hour before sleep.',
        'Consider a warm shower before bed to lower body temperature.'
      ];
      const tip = tips[Math.floor(Math.random() * tips.length)];
      speak(tip);
    }
    
    // Voice commands help
    else if (command.includes('commands') || command.includes('what can you do')) {
      speak('I can navigate pages, update sleep data, set alarms, play sounds, and provide sleep insights. Try saying: go to dashboard, set heart rate 65, play rain sounds, or how was my sleep.');
    }
    
    // Default response
    else {
      speak('I did not understand that command. Say "what can you do" to hear available voice commands.');
    }
  };

  const handleVoiceClick = () => {
    const profileName = userProfile?.name || user?.email?.split('@')[0] || 'User';
    speak(`Vanakam ${profileName}! This app is created by Kaniska the Cockroach. How can I help you today?`);
    
    setTimeout(() => {
      if (!recognitionRef.current) {
        speak('Voice recognition is not supported in your browser.');
        return;
      }
      recognitionRef.current.start();
      setIsListening(true);
    }, 3000);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      speak('Voice recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      handleVoiceClick();
    }
  };

  return (
    <div className="voice-assistant">
      <button 
        className={`voice-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={toggleListening}
        title={isListening ? 'Stop listening' : 'Touch to activate voice assistant'}
      >
        {isSpeaking ? (
          <span className="voice-emoji speaking-emoji">🗣️</span>
        ) : isListening ? (
          <span className="voice-emoji listening-emoji">👂</span>
        ) : (
          <span className="voice-emoji idle-emoji">🤖</span>
        )}
      </button>
      
      {isListening && (
        <div className="voice-status">
          <div className="listening-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Listening...</p>
        </div>
      )}
      
      {isSpeaking && (
        <div className="voice-status speaking">
          <Volume2 size={16} />
          <p>Speaking...</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;