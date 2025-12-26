
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Timeline from './components/Timeline';
import InputSection from './components/InputSection';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import { CalendarEvent, UserSettings, AppSection } from './types';
import { generateReminderSpeech } from './services/geminiService';
import { playPcmAudio } from './services/audio';

const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>(AppSection.Timeline);
  const [error, setError] = useState<string | null>(null);
  
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('calvoro_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load events from storage", e);
    }
    
    // Default dynamic date to prevent "static" feeling
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: '1',
        title: 'Calvoro Onboarding',
        date: today,
        time: '14:00',
        location: 'Calvoro App',
        urgency: 'high',
        status: 'upcoming',
        isVoiceInput: false
      }
    ];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('calvoro_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    return {
      voiceTone: 'Zephyr',
      reminderIntensity: 'standard',
      onboardingComplete: false,
      name: ''
    };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('calvoro_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('calvoro_settings', JSON.stringify(settings));
  }, [settings]);

  const addEvent = (partial: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: partial.title || 'New Appointment',
      date: partial.date || new Date().toISOString().split('T')[0],
      time: partial.time || '12:00',
      location: partial.location,
      urgency: partial.urgency || 'medium',
      status: 'upcoming',
      description: partial.description,
      isVoiceInput: true
    };
    setEvents(prev => [...prev, newEvent]);
    setSection(AppSection.Timeline);
    
    // Attempt announcement but don't crash if it fails
    speakReminder(newEvent).catch(console.error);
  };

  const speakReminder = async (event: CalendarEvent) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    setError(null);
    try {
      const base64Audio = await generateReminderSpeech(event, settings);
      await playPcmAudio(base64Audio, settings.voiceTone);
    } catch (e: any) {
      console.error("Speech error:", e);
      // Don't show technical error to user, just log it.
      // We set a silent failure so the timeline still works.
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleEventStatus = (id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, status: e.status === 'confirmed' ? 'upcoming' : 'confirmed' };
      }
      return e;
    }));
  };

  const handleOnboardingComplete = (name: string) => {
    setSettings(prev => ({ ...prev, name, onboardingComplete: true }));
  };

  if (!settings.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout activeSection={section} onSectionChange={setSection}>
      {section === AppSection.Timeline && (
        <Timeline 
          events={events} 
          onRemind={(e) => speakReminder(e)} 
          onStatusToggle={toggleEventStatus} 
        />
      )}
      {section === AppSection.Input && (
        <InputSection onAddEvent={addEvent} />
      )}
      {section === AppSection.Settings && (
        <Settings 
          settings={settings} 
          onUpdate={(upd) => setSettings(prev => ({ ...prev, ...upd }))} 
        />
      )}

      {/* Global Speaking Overlay */}
      {isSpeaking && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex gap-1 items-center h-4">
            <div className="w-1 bg-white rounded-full animate-bounce [animation-delay:0.1s] h-full"></div>
            <div className="w-1 bg-white rounded-full animate-bounce [animation-delay:0.2s] h-2/3"></div>
            <div className="w-1 bg-white rounded-full animate-bounce [animation-delay:0.3s] h-full"></div>
          </div>
          <span className="text-sm font-bold tracking-tight">Calvoro is speaking...</span>
        </div>
      )}
    </Layout>
  );
};

export default App;
