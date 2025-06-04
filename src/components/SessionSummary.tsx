
import React from 'react';
import { Clock, BookOpen, Trophy } from 'lucide-react';
import { Session } from '../pages/Index';

interface SessionSummaryProps {
  sessions: Session[];
  isDarkMode: boolean;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ sessions, isDarkMode }) => {
  const todayTotal = sessions.reduce((total, session) => total + session.duration, 0);
  const sessionCount = sessions.length;
  const lastSession = sessions[0];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/70 border border-slate-700' 
        : 'bg-white/80 border border-teal-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className={isDarkMode ? 'text-teal-400' : 'text-teal-600'} size={24} />
        <h3 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          Today's Summary
        </h3>
      </div>

      <div className="space-y-6">
        {/* Total Time */}
        <div className={`p-4 rounded-xl ${
          isDarkMode ? 'bg-slate-700/50' : 'bg-teal-50'
        }`}>
          <div className="flex items-center space-x-3">
            <Clock className={`${
              isDarkMode ? 'text-teal-400' : 'text-teal-600'
            }`} size={20} />
            <div>
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {formatTime(todayTotal)}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total study time
              </div>
            </div>
          </div>
        </div>

        {/* Session Count */}
        <div className={`p-4 rounded-xl ${
          isDarkMode ? 'bg-slate-700/50' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-3">
            <BookOpen className={`${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} size={20} />
            <div>
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {sessionCount}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Sessions completed
              </div>
            </div>
          </div>
        </div>

        {/* Last Session */}
        {lastSession && (
          <div className={`p-4 rounded-xl border-l-4 ${
            isDarkMode 
              ? 'bg-slate-700/50 border-l-green-400' 
              : 'bg-green-50 border-l-green-500'
          }`}>
            <div className={`text-sm font-medium mb-1 ${
              isDarkMode ? 'text-green-400' : 'text-green-700'
            }`}>
              Last Session
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {lastSession.duration} minutes
            </div>
            {lastSession.notes && (
              <div className={`text-sm mt-2 italic ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                "{lastSession.notes}"
              </div>
            )}
          </div>
        )}

        {/* Motivational Message */}
        {sessionCount === 0 ? (
          <div className={`text-center p-4 rounded-xl ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Ready to start your first session? 💪
            </div>
          </div>
        ) : (
          <div className={`text-center p-4 rounded-xl ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {sessionCount === 1 
                ? "Great start! Keep the momentum going! 🚀"
                : sessionCount < 5
                  ? "You're building great habits! 🌟"
                  : "Amazing consistency! You're on fire! 🔥"
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSummary;
