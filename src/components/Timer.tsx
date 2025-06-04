
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface TimerProps {
  onSessionComplete: (duration: number, notes: string, type: 'study' | 'short-break' | 'long-break') => void;
  isDarkMode: boolean;
}

const Timer: React.FC<TimerProps> = ({ onSessionComplete, isDarkMode }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'study' | 'short-break' | 'long-break'>('study');
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [notes, setNotes] = useState('');
  const [autoStart, setAutoStart] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const sessionConfigs = {
    study: { duration: 25 * 60, label: 'Study Session', icon: Clock, color: 'teal' },
    'short-break': { duration: 5 * 60, label: 'Short Break', icon: Coffee, color: 'green' },
    'long-break': { duration: 15 * 60, label: 'Long Break', icon: Zap, color: 'blue' }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    const completedDuration = Math.round((initialTime - timeLeft) / 60);
    
    if (completedDuration > 0) {
      onSessionComplete(completedDuration, notes, sessionType);
      toast({
        title: "Session Complete! 🎉",
        description: `Great job! You completed a ${completedDuration} minute ${sessionType.replace('-', ' ')} session.`,
      });
    }

    // Auto-start next session if enabled
    if (autoStart) {
      const nextType = sessionType === 'study' ? 'short-break' : 'study';
      handleSessionTypeChange(nextType);
      setTimeout(() => setIsRunning(true), 2000);
    }

    setNotes('');
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleSessionTypeChange = (type: 'study' | 'short-break' | 'long-break') => {
    setSessionType(type);
    const newDuration = sessionConfigs[type].duration;
    setInitialTime(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
  };

  const handleCustomTime = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const currentConfig = sessionConfigs[sessionType];
  const IconComponent = currentConfig.icon;

  return (
    <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/70 border border-slate-700' 
        : 'bg-white/80 border border-teal-200'
    }`}>
      {/* Session Type Selector */}
      <div className="flex justify-center mb-8">
        <div className={`flex rounded-2xl p-2 ${
          isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          {Object.entries(sessionConfigs).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => handleSessionTypeChange(type as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  sessionType === type
                    ? `bg-${config.color}-500 text-white shadow-lg scale-105`
                    : isDarkMode 
                      ? 'text-slate-300 hover:text-white hover:bg-slate-600' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`text-8xl font-mono font-bold mb-4 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Bar */}
        <div className={`w-full h-3 rounded-full mb-6 ${
          isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
        }`}>
          <div
            className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
              sessionType === 'study' 
                ? 'from-teal-400 to-teal-600' 
                : sessionType === 'short-break'
                  ? 'from-green-400 to-green-600'
                  : 'from-blue-400 to-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className={`bg-gradient-to-r ${
                sessionType === 'study' 
                  ? 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700' 
                  : sessionType === 'short-break'
                    ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              } text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <Play size={24} className="mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className={`px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Pause size={24} className="mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className={`px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
              isDarkMode 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RotateCcw size={24} />
          </Button>
        </div>
      </div>

      {/* Custom Time Input */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Custom minutes"
            className={`w-32 text-center ${
              isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''
            }`}
            onChange={(e) => {
              const minutes = parseInt(e.target.value);
              if (minutes > 0) handleCustomTime(minutes);
            }}
          />
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
            minutes
          </span>
        </div>
      </div>

      {/* Session Notes */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Session Notes (Optional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What are you working on?"
          className={`resize-none ${
            isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''
          }`}
          rows={3}
        />
      </div>

      {/* Auto-start Toggle */}
      <div className="flex items-center justify-center mt-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
            className="rounded"
          />
          <span className={`text-sm ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Auto-start next session
          </span>
        </label>
      </div>
    </div>
  );
};

export default Timer;
