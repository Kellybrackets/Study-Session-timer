
import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Session } from '../pages/Index';

interface DailyGoalsProps {
  goal: number;
  onGoalChange: (goal: number) => void;
  todaysSessions: Session[];
  isDarkMode: boolean;
}

const DailyGoals: React.FC<DailyGoalsProps> = ({ 
  goal, 
  onGoalChange, 
  todaysSessions, 
  isDarkMode 
}) => {
  const todayTotal = todaysSessions.reduce((total, session) => total + session.duration, 0);
  const progress = Math.min((todayTotal / goal) * 100, 100);
  const isGoalMet = todayTotal >= goal;

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
        <Target className={isDarkMode ? 'text-teal-400' : 'text-teal-600'} size={24} />
        <h3 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          Daily Goal
        </h3>
      </div>

      {/* Goal Setting */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Target Minutes per Day
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={goal}
            onChange={(e) => onGoalChange(parseInt(e.target.value) || 0)}
            className={`w-24 text-center ${
              isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''
            }`}
            min="1"
          />
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
            minutes ({formatTime(goal)})
          </span>
        </div>
      </div>

      {/* Progress Display */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className={`text-lg font-medium ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Today's Progress
          </span>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              isGoalMet 
                ? 'text-green-500' 
                : isDarkMode ? 'text-teal-400' : 'text-teal-600'
            }`}>
              {formatTime(todayTotal)}
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              of {formatTime(goal)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-4 rounded-full ${
          isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
        }`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalMet
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : 'bg-gradient-to-r from-teal-400 to-teal-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="flex justify-between items-center">
          <span className={`text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {progress.toFixed(0)}% complete
          </span>
          {isGoalMet && (
            <div className="flex items-center space-x-1 text-green-500">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">Goal achieved! 🎉</span>
            </div>
          )}
        </div>

        {/* Remaining Time */}
        {!isGoalMet && (
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-teal-50'
          }`}>
            <span className={`text-sm ${
              isDarkMode ? 'text-slate-300' : 'text-teal-700'
            }`}>
              {formatTime(Math.max(0, goal - todayTotal))} remaining to reach your goal
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyGoals;
