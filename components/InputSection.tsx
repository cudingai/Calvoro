
import React, { useState, useRef, useEffect } from 'react';
import { parseInputToEvent } from '../services/geminiService';
import { CalendarEvent } from '../types';

interface InputSectionProps {
  onAddEvent: (event: Partial<CalendarEvent>) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onAddEvent }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleParse(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleParse = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    try {
      const parsed = await parseInputToEvent(text);
      onAddEvent(parsed);
      setInputText('');
    } catch (error) {
      alert(error instanceof Error ? error.message : "Parsing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Add Appointment</h2>
        <p className="text-slate-500 text-sm">Speak or paste your appointment details</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <textarea
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-200 text-lg placeholder:text-slate-300 transition-all"
            placeholder="e.g. Doctor appointment tomorrow at 5pm at the City Hospital..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
          />
          <button 
            onClick={toggleListening}
            className={`absolute bottom-4 right-4 p-4 rounded-2xl shadow-lg transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        <button 
          onClick={() => handleParse(inputText)}
          disabled={isProcessing || !inputText.trim()}
          className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl shadow-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Confirm Appointment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
        <h4 className="text-emerald-800 font-bold mb-1">AI Tip</h4>
        <p className="text-emerald-700 text-sm leading-relaxed">
          Calvoro understands natural language. You can copy a WhatsApp message or just speak casually.
        </p>
      </div>
    </div>
  );
};

export default InputSection;
