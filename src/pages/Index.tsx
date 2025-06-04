
import React, { useState, useEffect } from 'react';
import Timer from '../components/Timer';
import SessionLog from '../components/SessionLog';
import DailyGoals from '../components/DailyGoals';
import SessionSummary from '../components/SessionSummary';
import { Moon, Sun } from 'lucide-react';

export interface Session {
  id: string;
  date: string;
  duration: number;
  notes: string;
  type: 'study' | 'short-break' | 'long-break';
}

const Index = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dailyGoal, setDailyGoal] = useState(120); // 2 hours in minutes
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    const savedGoal = localStorage.getItem('dailyGoal');
    const savedTheme = localStorage.getItem('darkMode');

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal));
    }
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save daily goal to localStorage
  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addSession = (duration: number, notes: string, type: 'study' | 'short-break' | 'long-break') => {
    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
      notes,
      type
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const todaysSessions = sessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.date).toDateString();
    return today === sessionDate && session.type === 'study';
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Study Session Timer
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Focus. Track. Achieve.
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
                : 'bg-white hover:bg-slate-100 text-slate-600'
            } shadow-lg`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Timer and Daily Goals */}
          <div className="lg:col-span-2 space-y-8">
            <Timer onSessionComplete={addSession} isDarkMode={isDarkMode} />
            <DailyGoals 
              goal={dailyGoal} 
              onGoalChange={setDailyGoal}
              todaysSessions={todaysSessions}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Column - Summary and Log */}
          <div className="space-y-8">
            <SessionSummary sessions={todaysSessions} isDarkMode={isDarkMode} />
            <SessionLog sessions={sessions} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Motivational Quote */}
        <div className={`mt-12 text-center p-6 rounded-2xl ${
          isDarkMode 
            ? 'bg-slate-800/50 border border-slate-700' 
            : 'bg-white/70 border border-teal-200'
        } backdrop-blur-sm`}>
          <p className={`text-lg italic ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            "The secret of getting ahead is getting started." - Mark Twain
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
