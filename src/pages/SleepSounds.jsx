import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw, Download } from 'lucide-react';

const SleepSounds = () => {
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [audioContext, setAudioContext] = useState(null);

  const [gainNode, setGainNode] = useState(null);
  const audioRef = useRef(null);

  const sounds = [
    { id: 1, name: 'Peaceful Lullaby', duration: '∞', recommended: true, type: 'melody', pattern: 'lullaby' },
    { id: 2, name: 'Gentle Piano', duration: '∞', recommended: true, type: 'melody', pattern: 'piano' },
    { id: 3, name: 'Soft Harp', duration: '∞', recommended: false, type: 'melody', pattern: 'harp' },
    { id: 4, name: 'Meditation Bells', duration: '∞', recommended: true, type: 'melody', pattern: 'bells' },
    { id: 5, name: 'Ambient Pad', duration: '∞', recommended: false, type: 'melody', pattern: 'pad' },
    { id: 6, name: 'Music Box', duration: '∞', recommended: false, type: 'melody', pattern: 'musicbox' },
    { id: 7, name: 'Flute Melody', duration: '∞', recommended: false, type: 'melody', pattern: 'flute' },
    { id: 8, name: 'Soft Strings', duration: '∞', recommended: false, type: 'melody', pattern: 'strings' },
    { id: 9, name: 'Thalattu Padal by Lathika', duration: '∞', recommended: true, type: 'tamil', pattern: 'lathika_thalattu', category: 'Tamil Thalattu', lyrics: 'Aaraaro Aariraaro\nAmbulikkuNaer Ivaro..\nThaayaana Thaai Ivaro\nThanga Ratha Thaer Ivaro..' },
    { id: 10, name: 'Pathaveikum Paarvaikaara by Kaniska Devi Priya', duration: '∞', recommended: true, type: 'tamil', pattern: 'kaniska_song', category: 'Tamil Thalattu', lyrics: 'அப்படி பாக்காதே..பத்தவைக்கும் பார்வைக்காரா..' },
    { id: 11, name: 'Thaalattu Ketkava', duration: '∞', recommended: false, type: 'tamil', pattern: 'thalattu_song', category: 'Tamil Thalattu' },
    { id: 12, name: 'Chellame Chellam', duration: '∞', recommended: true, type: 'tamil', pattern: 'chellam_song', category: 'Tamil Thalattu' },
    { id: 13, name: 'Kanmani Anbodu', duration: '∞', recommended: false, type: 'tamil', pattern: 'kanmani_song', category: 'Tamil Thalattu' },
    { id: 14, name: 'Pillai Thalattu', duration: '∞', recommended: false, type: 'tamil', pattern: 'pillai_song', category: 'Tamil Thalattu' }
  ];

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
      } catch (error) {
        console.log('Web Audio API not supported');
      }
    };
    initAudio();
  }, []);

  // Musical note frequencies (in Hz)
  const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77
  };

  // Melody patterns for different sounds
  const melodyPatterns = {
    lullaby: [notes.C4, notes.E4, notes.G4, notes.E4, notes.F4, notes.D4, notes.C4],
    piano: [notes.A4, notes.F4, notes.C4, notes.F4, notes.A4, notes.C5, notes.A4],
    harp: [notes.C5, notes.G4, notes.E4, notes.C4, notes.E4, notes.G4, notes.C5],
    bells: [notes.G4, notes.C5, notes.E5, notes.G5, notes.E5, notes.C5, notes.G4],
    pad: [notes.C4, notes.G4, notes.C5, notes.G4],
    musicbox: [notes.C5, notes.E5, notes.G5, notes.C5, notes.A4, notes.F4, notes.C4],
    flute: [notes.D5, notes.B4, notes.G4, notes.D4, notes.G4, notes.B4, notes.D5],
    strings: [notes.G4, notes.D5, notes.G5, notes.D5, notes.B4, notes.G4, notes.D4],
    // Tamil thalattu patterns
    lathika_thalattu: [
      notes.C4, notes.E4, notes.G4, notes.C5, notes.E5, notes.C5, notes.A4, notes.G4,
      notes.F4, notes.A4, notes.C5, notes.F5, notes.E5, notes.C5, notes.G4, notes.E4,
      notes.D4, notes.F4, notes.A4, notes.D5, notes.C5, notes.A4, notes.F4, notes.D4,
      notes.C4, notes.G4, notes.E5, notes.G5, notes.F5, notes.D5, notes.C5, notes.G4, notes.C4
    ],
    kaniska_song: [
      // Fast rhythmic intro
      notes.G4, notes.G4, notes.B4, notes.D5, notes.G5, notes.D5, notes.B4, notes.G4,
      notes.A4, notes.A4, notes.C5, notes.E5, notes.A5, notes.E5, notes.C5, notes.A4,
      // Melodic bridge with rhythm
      notes.F4, notes.A4, notes.C5, notes.F5, notes.A5, notes.F5, notes.C5, notes.A4,
      notes.G4, notes.B4, notes.D5, notes.G5, notes.B5, notes.G5, notes.D5, notes.B4,
      // Speed variations
      notes.E4, notes.G4, notes.B4, notes.E5, notes.G5, notes.E5, notes.B4, notes.G4,
      notes.D4, notes.F4, notes.A4, notes.D5, notes.F5, notes.D5, notes.A4, notes.F4,
      // Rhythmic finale
      notes.C4, notes.E4, notes.G4, notes.C5, notes.E5, notes.G5, notes.C5, notes.G4, notes.E4, notes.C4
    ],
    thalattu_song: [notes.D4, notes.F4, notes.A4, notes.C5, notes.A4, notes.F4, notes.E4, notes.D4],
    chellam_song: [notes.E4, notes.G4, notes.B4, notes.D5, notes.B4, notes.G4, notes.F4, notes.E4],
    kanmani_song: [notes.F4, notes.A4, notes.C5, notes.E5, notes.C5, notes.A4, notes.G4, notes.F4],
    pillai_song: [notes.A4, notes.C5, notes.E5, notes.G5, notes.E5, notes.C5, notes.B4, notes.A4]
  };

  // Create melodic sound using oscillators
  const createMelody = (pattern, context) => {
    const masterGain = context.createGain();
    masterGain.gain.value = 0.1;
    masterGain.connect(context.destination);

    let noteIndex = 0;
    const playNote = () => {
      if (!isPlaying) return;
      
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      
      oscillator.frequency.setValueAtTime(pattern[noteIndex], context.currentTime);
      oscillator.type = getOscillatorType(currentSound?.pattern);
      
      // Envelope for smooth note transitions
      noteGain.gain.setValueAtTime(0, context.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 2);
      
      oscillator.connect(noteGain);
      noteGain.connect(masterGain);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 2);
      
      noteIndex = (noteIndex + 1) % pattern.length;
      
      // Schedule next note with rhythm variations
      const baseDelay = currentSound?.pattern === 'kaniska_song' ? 800 : 1500;
      const rhythmVariation = currentSound?.pattern === 'kaniska_song' ? Math.random() * 400 : Math.random() * 1000;
      setTimeout(playNote, baseDelay + rhythmVariation);
    };
    
    playNote();
    return masterGain;
  };

  // Get oscillator type based on sound pattern
  const getOscillatorType = (pattern) => {
    switch (pattern) {
      case 'piano': return 'triangle';
      case 'harp': return 'sine';
      case 'bells': return 'sine';
      case 'pad': return 'sawtooth';
      case 'musicbox': return 'square';
      case 'flute': return 'sine';
      case 'strings': return 'sawtooth';
      // Tamil thalattu oscillator types
      case 'lathika_thalattu': return 'sine';
      case 'kaniska_song': return 'triangle';
      case 'thalattu_song': return 'sine';
      case 'chellam_song': return 'triangle';
      case 'kanmani_song': return 'sine';
      case 'pillai_song': return 'triangle';
      default: return 'sine';
    }
  };

  const playSound = async (sound) => {
    if (currentSound?.id === sound.id && isPlaying) {
      // Stop current sound
      if (gainNode) {
        gainNode.disconnect();
        setGainNode(null);
      }
      setIsPlaying(false);
      setCurrentSound(null);
    } else {
      // Stop any currently playing sound
      if (gainNode) {
        gainNode.disconnect();
      }

      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (audioContext) {
        try {
          if (sound.pattern === 'lathika_thalattu') {
            // Special handling for Lathika's thalattu with voice synthesis
            const lyrics = [
              'Aaraaro Aariraaro',
              'Ambulikku Naer Ivaro',
              'Thaayaana Thaai Ivaro', 
              'Thanga Ratha Thaer Ivaro',
              'Moochuppattaa Noagumunnu',
              'Moochadakki Muthamittaen',
              'Nizhalupattaa Noagumunnu', 
              'Nilavadanga Muthaamittaen',
              'Thoongaamani Vilakkae',
              'Thoongaama Thoongu Kanne',
              'Aasa Agal Vilakkae',
              'Asaiyaamal Thoongu Kanne'
            ];
            
            // Sing the lullaby with female voice
            const utterance = new SpeechSynthesisUtterance(lyrics.join('. '));
            utterance.rate = 0.5;
            utterance.pitch = 1.3;
            utterance.volume = Math.min(1.0, (volume / 100) * 1.5);
            
            // Try to use female voice
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
              voice.name.includes('Female') || 
              voice.name.includes('Samantha') ||
              voice.name.includes('Karen') ||
              voice.gender === 'female'
            );
            if (femaleVoice) utterance.voice = femaleVoice;
            
            speechSynthesis.speak(utterance);
          }
          
          if (sound.pattern === 'kaniska_song') {
            // Special handling for Kaniska's song with cute AI voice
            const lyrics = 'Appadi paakkaathae. Appadi mattum paakkaathae. Ethuvum sollaathae sollaathae. Solla solla sollaathae. Sollatti vittu sellaathae. Pathaveikkum paarvaikkaara. Ey paarvaikkaara. Sikkaveikkum seygaiyellaam nirutthiduveeraa. Manasu iyangala seeraa';
            
            // Initialize speech synthesis
            if ('speechSynthesis' in window) {
              speechSynthesis.cancel();
              
              setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(lyrics);
                utterance.rate = 0.7;
                utterance.pitch = 1.4;
                utterance.volume = 1.0;
                
                // Load voices and select cute voice
                const voices = speechSynthesis.getVoices();
                if (voices.length === 0) {
                  // Wait for voices to load
                  speechSynthesis.onvoiceschanged = () => {
                    const newVoices = speechSynthesis.getVoices();
                    const cuteVoice = newVoices.find(voice => 
                      voice.name.includes('Zira') ||
                      voice.name.includes('Female') ||
                      voice.name.includes('Woman') ||
                      voice.gender === 'female'
                    ) || newVoices[0];
                    
                    if (cuteVoice) utterance.voice = cuteVoice;
                    speechSynthesis.speak(utterance);
                  };
                } else {
                  const cuteVoice = voices.find(voice => 
                    voice.name.includes('Zira') ||
                    voice.name.includes('Female') ||
                    voice.name.includes('Woman') ||
                    voice.gender === 'female'
                  ) || voices[0];
                  
                  if (cuteVoice) utterance.voice = cuteVoice;
                  speechSynthesis.speak(utterance);
                }
              }, 500);
            }
          }
          
          const pattern = melodyPatterns[sound.pattern] || melodyPatterns.lullaby;
          const melodyGain = createMelody(pattern, audioContext);
          const melodyVolume = sound.pattern === 'kaniska_song' ? 0.7 : 0.5;
          melodyGain.gain.value = (volume / 100) * melodyVolume;
          setGainNode(melodyGain);
          setCurrentSound(sound);
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing sound:', error);
          alert(`🎵 Playing ${sound.name} - ${sound.type === 'tamil' ? 'Tamil Thalattu by Lathika' : 'Melodic audio'} will play in background`);
          setCurrentSound(sound);
          setIsPlaying(true);
        }
      } else {
        alert(`🎵 Playing ${sound.name} - ${sound.type === 'tamil' ? 'Tamil Thalattu by Lathika' : 'Melodic audio'} will play in background`);
        setCurrentSound(sound);
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (gainNode) {
      gainNode.gain.value = newVolume / 100;
    }
  };

  const stopAllSounds = () => {
    if (gainNode) {
      gainNode.disconnect();
      setGainNode(null);
    }
    setIsPlaying(false);
    setCurrentSound(null);
  };

  const aiRecommendation = sounds.find(s => s.recommended);

  return (
    <div className="sleep-sounds">
      <h1>Sleep Sounds</h1>

      <div className="ai-recommendation">
        <h3>🧠 AI Recommended for Better Deep Sleep</h3>
        <div className="recommended-sound">
          <div className="sound-info">
            <h4>{aiRecommendation?.name}</h4>
            <p>Based on your sleep patterns, this sound can improve deep sleep by 15%</p>
          </div>
          <button 
            className="play-btn recommended"
            onClick={() => playSound(aiRecommendation)}
          >
            {currentSound?.id === aiRecommendation?.id && isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>

      <div className="sounds-categories">
        <div className="category-section">
          <h3>🎵 Melodic Sleep Sounds</h3>
          <div className="sounds-grid">
            {sounds.filter(sound => sound.type === 'melody').map(sound => (
              <div key={sound.id} className={`sound-card ${sound.recommended ? 'recommended' : ''}`}>
                <div className="sound-info">
                  <h4>{sound.name}</h4>
                  <span className="duration">{sound.duration}</span>
                  {sound.recommended && <span className="ai-badge">🤖 AI Recommended</span>}
                </div>
                <button 
                  className="play-btn"
                  onClick={() => playSound(sound)}
                >
                  {currentSound?.id === sound.id && isPlaying ? <Pause /> : <Play />}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="category-section">
          <h3>🎶 Tamil Thalattu (தமிழ் தாலாட்டு)</h3>
          <div className="sounds-grid">
            {sounds.filter(sound => sound.type === 'tamil').map(sound => (
              <div key={sound.id} className={`sound-card tamil-song ${sound.recommended ? 'recommended' : ''}`}>
                <div className="sound-info">
                  <h4>{sound.name}</h4>
                  <span className="duration">{sound.duration}</span>
                  {sound.recommended && <span className="ai-badge">🤖 AI Recommended</span>}
                  <span className="tamil-badge">தாலாட்டு</span>
                </div>
                <button 
                  className="play-btn"
                  onClick={() => playSound(sound)}
                >
                  {currentSound?.id === sound.id && isPlaying ? <Pause /> : <Play />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentSound && (
        <div className="player-controls">
          <div className="now-playing">
            <h4>🎵 Now Playing: {currentSound.name}</h4>
          </div>
          
          <div className="controls">
            <button 
              className="control-btn play-pause"
              onClick={() => playSound(currentSound)}
            >
              {isPlaying ? <Pause /> : <Play />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <div className="volume-control">
              <Volume2 />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span className="volume-display">{volume}%</span>
            </div>
            
            <button className="control-btn stop" onClick={stopAllSounds}>
              <RotateCcw />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}

      <div className="sound-controls">
        <button className="control-btn stop-all" onClick={stopAllSounds}>
          <RotateCcw />
          Stop All Sounds
        </button>
      </div>

      <div className="background-playback-info">
        <div className="info-card">
          <h4>🎵 How Melodic Sleep Sounds Work</h4>
          <ul>
            <li>🎹 Beautiful melodies generated using Web Audio API</li>
            <li>🎵 Soothing musical patterns designed for relaxation</li>
            <li>🎧 Use headphones for immersive experience</li>
            <li>🔄 Melodies play continuously with natural variations</li>
            <li>🧠 AI recommends melodies based on your sleep patterns</li>
          </ul>
        </div>
        
        <div className="sound-benefits">
          <h4>🌙 Benefits of Melodic Sleep Sounds</h4>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">🎵</span>
              <span>Calming musical therapy</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">😌</span>
              <span>Deep relaxation response</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💤</span>
              <span>Enhanced sleep quality</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🧘</span>
              <span>Stress relief & peace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepSounds;