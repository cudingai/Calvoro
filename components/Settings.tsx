
import React from 'react';
import { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const voices: UserSettings['voiceTone'][] = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
  const intensities: UserSettings['reminderIntensity'][] = ['gentle', 'standard', 'persistent'];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Personalization</h2>
        <p className="text-slate-500 text-sm">Make Calvoro sound and act like you.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Voice Persona</label>
          <div className="grid grid-cols-2 gap-3">
            {voices.map(voice => (
              <button
                key={voice}
                onClick={() => onUpdate({ voiceTone: voice })}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${settings.voiceTone === voice ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                {voice}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Reminder Style</label>
          <div className="flex flex-col gap-2">
            {intensities.map(intensity => (
              <button
                key={intensity}
                onClick={() => onUpdate({ reminderIntensity: intensity })}
                className={`flex items-center justify-between py-4 px-5 rounded-2xl border transition-all ${settings.reminderIntensity === intensity ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                <span className="capitalize">{intensity}</span>
                {settings.reminderIntensity === intensity && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">Auto-sync Calendar</span>
            <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-xs text-slate-400">Calvoro automatically checks for new events in your connected Google and Outlook accounts.</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button className="text-rose-500 text-sm font-semibold">Delete Account & Data</button>
      </div>
    </div>
  );
};

export default Settings;
