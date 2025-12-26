
import React from 'react';
import { CalendarEvent } from '../types';
import EventCard from './EventCard';

interface TimelineProps {
  events: CalendarEvent[];
  onRemind: (event: CalendarEvent) => void;
  onStatusToggle: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onRemind, onStatusToggle }) => {
  const sortedEvents = [...events].sort((a, b) => {
    return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  });

  const upcoming = sortedEvents.filter(e => e.status !== 'confirmed' && e.status !== 'missed');
  const finished = sortedEvents.filter(e => e.status === 'confirmed' || e.status === 'missed');

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Today's Guardian</h2>
        <div className="flex gap-2">
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded tracking-tighter">
            {formattedDate}
          </span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-slate-900 font-semibold">Peace and quiet</h3>
            <p className="text-slate-400 text-sm">No upcoming events found. Enjoy your time.</p>
          </div>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming</h3>
              <div className="flex flex-col gap-4">
                {upcoming.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onRemind={onRemind} 
                    onStatusToggle={onStatusToggle}
                  />
                ))}
              </div>
            </section>
          )}

          {finished.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed & Others</h3>
              <div className="flex flex-col gap-4">
                {finished.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onRemind={onRemind} 
                    onStatusToggle={onStatusToggle}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Timeline;
