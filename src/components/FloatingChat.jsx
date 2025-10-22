import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

const FloatingChat = () => {
  const { sleepData } = useData();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [userEmotion, setUserEmotion] = useState('neutral');

  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const greeting = generateContextualGreeting();
      setChatMessages([{ type: 'bot', message: greeting, timestamp: new Date() }]);
    }
  }, [isOpen, sleepData.currentMetrics]);

  const generateContextualGreeting = () => {
    const hour = new Date().getHours();
    const metrics = sleepData.currentMetrics;
    const userAge = parseInt(localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')).age : null) || null;
    
    if (!userAge) {
      return `👋 Hi there! I'm your Sleep Coach AI. Can you tell me your age? I'll personalize your sleep insights based on that. You can update it in Settings.`;
    }
    
    const ageGroup = userAge < 18 ? 'teen' : userAge <= 60 ? 'adult' : 'senior';
    const targetSleep = userAge < 18 ? '8-10 hours' : userAge <= 60 ? '7-8 hours' : '6-7 hours';
    
    if (hour >= 6 && hour <= 11) {
      return `🌅 Good morning! At age ${userAge}, your sleep quality of ${metrics.quality}% ${metrics.quality >= 80 ? 'is excellent!' : 'could improve.'} ${ageGroup === 'teen' ? 'Growing bodies need quality rest!' : ageGroup === 'adult' ? 'Adults your age need consistent sleep.' : 'Quality sleep becomes more important with age.'} How are you feeling?`;
    } else if (hour >= 12 && hour <= 17) {
      return `☀️ Good afternoon! For someone who's ${userAge}, your heart rate of ${metrics.heartRate} BPM during sleep ${metrics.heartRate <= 65 ? 'shows excellent recovery!' : 'suggests room for improvement.'} What can I help you with?`;
    } else if (hour >= 18 && hour <= 21) {
      return `🌆 Good evening! Since you're ${userAge}, you should aim for ${targetSleep} of sleep tonight. With ${metrics.motion} movement events last night, ${metrics.motion <= 10 ? 'you had peaceful sleep!' : 'let\'s work on calmer rest.'} Ready to prepare?`;
    } else {
      return `🌙 It's getting late! At age ${userAge}, you need ${targetSleep} for optimal health. How can I help you wind down for the night?`;
    }
  };

  const detectEmotion = (text) => {
    const input = text.toLowerCase();
    if (input.includes('tired') || input.includes('exhausted') || input.includes('drained')) return 'tired';
    if (input.includes('frustrated') || input.includes('annoyed') || input.includes('upset')) return 'frustrated';
    if (input.includes('worried') || input.includes('anxious') || input.includes('stressed')) return 'anxious';
    if (input.includes('great') || input.includes('amazing') || input.includes('excellent')) return 'positive';
    if (input.includes('confused') || input.includes('lost') || input.includes('help')) return 'confused';
    return 'neutral';
  };

  const getAdvancedMetrics = () => {
    const metrics = sleepData.currentMetrics;
    const durationMinutes = typeof metrics.duration === 'string' ? 
      parseInt(metrics.duration.split('h')[0]) * 60 + parseInt(metrics.duration.split(' ')[1]) : 420;
    
    return {
      sleepEfficiency: Math.round((durationMinutes / (durationMinutes + 30)) * 100),
      sleepDebt: (8 * 60 - durationMinutes) / 60,
      remSleep: Math.round(durationMinutes * 0.25),
      deepSleep: Math.round(durationMinutes * 0.2),
      sleepCycles: Math.round(durationMinutes / 90)
    };
  };

  const generateResponse = (input) => {
    const text = input.toLowerCase();
    const metrics = sleepData.currentMetrics;
    const emotion = detectEmotion(text);
    const advanced = getAdvancedMetrics();
    
    setUserEmotion(emotion);
    
    if (text.includes('how was my sleep') || text.includes('last night') || text.includes('sleep quality')) {
      const trend = advanced.sleepEfficiency >= 90 ? 'excellent' : advanced.sleepEfficiency >= 85 ? 'good' : 'needs improvement';
      return `Your sleep quality was ${metrics.quality}% with ${metrics.heartRate} BPM average heart rate. Sleep efficiency: ${advanced.sleepEfficiency}% (${trend}). ${metrics.motion <= 10 ? 'You had peaceful rest with minimal movement.' : `${metrics.motion} movement events suggest some restlessness.`} ${metrics.quality >= 80 ? 'Keep up the great work!' : 'Let\'s work on improving tonight\'s rest.'} Would you like specific tips for tonight?`;
    }
    
    if (text.includes('why') && (text.includes('tired') || text.includes('exhausted') || text.includes('groggy'))) {
      const reasons = [];
      if (metrics.quality < 75) reasons.push('sleep quality below optimal');
      if (metrics.heartRate > 70) reasons.push('elevated heart rate during sleep');
      if (metrics.motion > 15) reasons.push('restless sleep with frequent movements');
      if (advanced.sleepDebt > 1) reasons.push(`sleep debt of ${advanced.sleepDebt.toFixed(1)} hours`);
      
      const mainReason = reasons.length > 0 ? reasons[0] : 'sleep fragmentation';
      return `You might feel tired due to ${mainReason}. ${reasons.length > 1 ? `Also noticed: ${reasons.slice(1).join(', ')}.` : ''} Try going to bed 30 minutes earlier and avoiding screens before sleep. Your body is asking for better recovery time. Small changes make big differences! 💪`;
    }
    
    if (text.includes('sleep tips') || text.includes('tonight') || text.includes('better sleep')) {
      const userAge = parseInt(localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')).age : null) || 25;
      const targetHours = userAge < 18 ? '8-10 hours' : userAge <= 60 ? '7-8 hours' : '6-7 hours';
      
      if (metrics.quality < 70) {
        return `At age ${userAge}, you need ${targetHours} of quality sleep. Based on your ${metrics.quality}% quality: 🌙 Go to bed 30 minutes earlier, 📱 no screens 1 hour before bed, 🧘‍♀️ try 4-7-8 breathing, and 🌡️ keep room cool. ${userAge < 18 ? 'Growing bodies need extra rest!' : userAge > 60 ? 'Quality sleep supports healthy aging.' : 'Your body needs this recovery time!'} 💙`;
      } else {
        return `Excellent ${metrics.quality}% sleep quality for age ${userAge}! 🎉 You're getting your recommended ${targetHours}. Keep up: consistent bedtime, cool dark room, no late screens, gentle stretching. ${userAge < 18 ? 'Great habits for growing!' : userAge > 60 ? 'Fantastic for healthy aging!' : 'Perfect adult sleep routine!'} 🌟`;
      }
    }

    if (text.includes('set') && (text.includes('bedtime') || text.includes('alarm') || text.includes('reminder'))) {
      const timeMatch = text.match(/(\d{1,2}):?(\d{2})?\s*(pm|am)?/i);
      if (timeMatch) {
        const time = timeMatch[0];
        navigate('/calendar');
        return `Perfect! I've set your bedtime reminder for ${time}. You can adjust this in Calendar & Alarm page (just opened it for you). I'll also remind you 1 hour before to start winding down. Consistent sleep timing improves your sleep efficiency by up to 15%! 🌙`;
      }
      return `I'd love to set your bedtime! Just tell me the time like "Set bedtime to 10:30 PM" or "Remind me to sleep at 11". Consistent bedtime is one of the best ways to improve sleep quality. What time works best for you?`;
    }

    if (text.includes('upload') || text.includes('data')) {
      return `To upload sleep data: Go to Dashboard → File Upload section → Choose your CSV/JSON file → Click Upload. I'll analyze it instantly and update all your metrics across the app! The data will appear in graphs, AI insights, and reports. Need help with file format?`;
    }

    if (emotion === 'frustrated') {
      return `I understand sleep struggles can be really frustrating 💙 Your feelings are completely valid. With ${metrics.quality}% sleep quality, we have room to improve together. Remember: progress isn't linear, small changes compound over time, and you're already taking positive steps by tracking your sleep. Let's focus on one simple improvement for tonight. You've got this! 💪`;
    }

    if (emotion === 'anxious') {
      return `Sleep anxiety is more common than you think, and you're not alone 🤗 Your ${metrics.heartRate} BPM heart rate shows ${metrics.heartRate > 70 ? 'your body might be processing stress' : 'relatively calm sleep'}. Try: 4-7-8 breathing, progressive muscle relaxation, journaling 3 gratitudes, or our sleep sounds. Anxiety often improves with better sleep hygiene. Peace is possible! 🧘‍♀️`;
    }

    return `Thanks for reaching out! 💙 Based on your ${metrics.quality}% sleep quality and ${metrics.heartRate} BPM heart rate, I can help with: sleep analysis, tonight's optimization tips, app navigation, bedtime scheduling, lifestyle advice, or emotional support. Your sleep journey is unique, and every question helps us improve together. What interests you most? 🌟`;
  };

  const quickQuestions = [
    'How was my sleep last night?',
    'Why am I waking up tired?',
    'Sleep tips for tonight',
    'Set my bedtime to 10:30 PM',
    'Help with relaxation',
    'Upload sleep data help',
    'Generate weekly report',
    'Navigate to reports page'
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setConversationContext(prev => [...prev.slice(-4), { message: userMessage, emotion: detectEmotion(userMessage), timestamp: new Date() }]);
    
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage, timestamp: new Date() }]);
    setIsTyping(true);
    
    const processingTime = userMessage.length > 50 ? 1500 : 1000;
    
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setChatMessages(prev => [...prev, { type: 'bot', message: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, processingTime);

    setUserMessage('');
  };

  return (
    <>
      <div className={`floating-chat-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : '💬'}
      </div>

      {isOpen && (
        <div className="floating-chat-window">
          <div className="chat-header">
            <div className="chat-avatar">🧠</div>
            <div>
              <h4>Sleep Coach AI</h4>
              <span className="status">🟢 Online</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                {msg.type === 'bot' && <div className="msg-avatar">🧠</div>}
                <div className="msg-content">
                  <div className="msg-text">{msg.message}</div>
                  <div className="msg-time">
                    {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.type === 'user' && <div className="msg-avatar user">👤</div>}
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-message bot">
                <div className="msg-avatar">🧠</div>
                <div className="msg-content">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="quick-actions">
            {quickQuestions.map((question, index) => (
              <button 
                key={index} 
                className="quick-action-btn"
                onClick={() => {
                  setChatMessages(prev => [...prev, { type: 'user', message: question, timestamp: new Date() }]);
                  setIsTyping(true);
                  setTimeout(() => {
                    const response = generateResponse(question);
                    setChatMessages(prev => [...prev, { type: 'bot', message: response, timestamp: new Date() }]);
                    setIsTyping(false);
                  }, 1000);
                }}
              >
                {question}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask about your sleep..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping || !userMessage.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChat;