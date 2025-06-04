
import React, { useState } from 'react';
import { Clock, Coffee, Zap, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Session } from '../pages/Index';

interface SessionLogProps {
  sessions: Session[];
  isDarkMode: boolean;
}

const SessionLog: React.FC<SessionLogProps> = ({ sessions, isDarkMode }) => {
  const [showAll, setShowAll] = useState(false);

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'study': return Clock;
      case 'short-break': return Coffee;
      case 'long-break': return Zap;
      default: return Clock;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'study': return 'text-teal-500';
      case 'short-break': return 'text-green-500';
      case 'long-break': return 'text-blue-500';
      default: return 'text-teal-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (sessionDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (sessionDate.getTime() === today.getTime() - 86400000) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Duration (minutes)', 'Type', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...sessions.map(session => [
        new Date(session.date).toLocaleString(),
        session.duration.toString(),
        session.type,
        `"${session.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-sessions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const displayedSessions = showAll ? sessions : sessions.slice(0, 10);

  return (
    <div className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/70 border border-slate-700' 
        : 'bg-white/80 border border-teal-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className={isDarkMode ? 'text-teal-400' : 'text-teal-600'} size={24} />
          <h3 className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Session History
          </h3>
        </div>
        {sessions.length > 0 && (
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className={`${
              isDarkMode 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className={`text-center py-8 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No sessions yet. Start your first session!</p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {displayedSessions.map((session) => {
                const IconComponent = getSessionIcon(session.type);
                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-slate-700/50 hover:bg-slate-700' 
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent 
                        size={20} 
                        className={`mt-1 ${getSessionColor(session.type)}`} 
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {session.duration} min {session.type.replace('-', ' ')}
                          </span>
                          <span className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {formatDate(session.date)}
                          </span>
                        </div>
                        {session.notes && (
                          <p className={`text-sm ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {sessions.length > 10 && (
            <div className="text-center mt-4">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="ghost"
                size="sm"
                className={`${
                  isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {showAll ? 'Show Less' : `Show All (${sessions.length})`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionLog;
