
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');

  const next = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 bg-white z-[100] p-8 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-12">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Calvoro</h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xs mx-auto">
              Your appointments aren't just dates. They are moments. We help you guard them.
            </p>
            <button 
              onClick={next}
              className="mt-12 px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-xs">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Who are we guarding time for?</h2>
            <input 
              type="text" 
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-5 bg-slate-100 border-none rounded-2xl text-xl focus:ring-2 focus:ring-slate-200 outline-none text-center"
            />
            <button 
              onClick={next}
              disabled={!name}
              className="mt-8 w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl disabled:opacity-30 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Permissions</h2>
            <p className="text-slate-500 mb-8">To speak and listen, we need access to your microphone and calendar.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="text-left">
                   <p className="font-bold text-slate-900 text-sm">Microphone</p>
                   <p className="text-slate-500 text-xs">For voice appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                   <p className="font-bold text-slate-900 text-sm">Calendar Sync</p>
                   <p className="text-slate-500 text-xs">Stay in loop with Google/Apple</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onComplete(name)}
              className="mt-12 w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl transition-all"
            >
              Allow & Finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
