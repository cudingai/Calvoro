
import React from 'react';
import { CalendarEvent, UrgencyLevel } from '../types';

interface EventCardProps {
  event: CalendarEvent;
  onRemind: (event: CalendarEvent) => void;
  onStatusToggle: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRemind, onStatusToggle }) => {
  const urgencyColors = {
    low: 'bg-emerald-50 text-emerald-600',
    medium: 'bg-amber-50 text-amber-600',
    high: 'bg-orange-50 text-orange-600',
    urgent: 'bg-rose-50 text-rose-600'
  };

  const statusColors = {
    upcoming: 'border-slate-100 opacity-100',
    confirmed: 'border-emerald-200 bg-emerald-50/20 opacity-90',
    missed: 'border-rose-100 bg-rose-50/10 opacity-70 grayscale',
    rescheduled: 'border-slate-200 bg-slate-50/50 opacity-60'
  };

  return (
    <div className={`relative flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300 ${statusColors[event.status]}`}>
      <div className="flex justify-between items-start">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${urgencyColors[event.urgency]}`}>
          {event.urgency}
        </span>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => onRemind(event)}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 0" />
            </svg>
          </button>
          <button 
            onClick={() => onStatusToggle(event.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${event.status === 'confirmed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}
          >
            {event.status === 'confirmed' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold leading-tight ${event.status === 'confirmed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {event.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {event.time}
          </span>
          {event.location && (
            <span className="flex items-center gap-1 truncate">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </span>
          )}
        </div>
      </div>

      {event.status === 'missed' && (
        <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
          <p className="text-xs text-rose-700 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            This was missed. Suggesting a reschedule...
          </p>
        </div>
      )}
    </div>
  );
};

export default EventCard;
