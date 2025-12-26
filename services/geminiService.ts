
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CalendarEvent, UserSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseInputToEvent = async (input: string): Promise<Partial<CalendarEvent>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following user input and extract appointment details. User input: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          date: { type: Type.STRING, description: "YYYY-MM-DD format" },
          time: { type: Type.STRING, description: "HH:mm format" },
          location: { type: Type.STRING },
          urgency: { 
            type: Type.STRING, 
            enum: ["low", "medium", "high", "urgent"] 
          },
          description: { type: Type.STRING }
        },
        required: ["title", "date", "time", "urgency"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse event JSON", e);
    throw new Error("I couldn't quite catch the details of that appointment. Could you try again?");
  }
};

export const generateReminderSpeech = async (event: CalendarEvent, settings: UserSettings): Promise<string> => {
  // Use a direct instruction to ensure the model outputs audio. 
  // Complex prompts often cause the model to return text, triggering a 400 error.
  const prompt = `Say: Hi, this is your reminder for ${event.title} at ${event.time}${event.location ? ' at ' + event.location : ''}.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: settings.voiceTone },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("The guardian is silent. No audio was generated.");
  return base64Audio;
};

export const generateRescheduleSuggestion = async (event: CalendarEvent): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user missed an appointment for "${event.title}". Suggest a kind, brief voice message asking to reschedule.`,
  });
  return response.text || '';
};
