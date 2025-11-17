import { GoogleGenAI } from "@google/genai";
import { AiAction } from '../types';

const getPrompt = (action: AiAction, text: string, options?: { language?: string }): string => {
    switch (action) {
        case AiAction.Summarize:
            return `Summarize the following text into a few key bullet points. Use a clear, concise style:\n\n---\n${text}\n---`;
        case AiAction.Improve:
            return `Rewrite the following text to improve its clarity, grammar, and overall quality. Correct any spelling mistakes and awkward phrasing. Return only the improved text without any preamble:\n\n---\n${text}\n---`;
        case AiAction.Translate:
            return `Translate the following text to ${options?.language || 'French'}. Return only the translated text:\n\n---\n${text}\n---`;
        case AiAction.GenerateIdeas:
            return `Based on the following text, brainstorm 5 related ideas or concepts. Present them as a numbered list:\n\n---\n${text}\n---`;
        case AiAction.FindActionItems:
            return `Extract all actionable tasks or to-do items from the following text. If none are found, state "No action items found." Present them as a simple list:\n\n---\n${text}\n---`;
        case AiAction.CheckSpelling:
            return `Review the following text for spelling and grammar errors. For each error found, provide the original word/phrase and the suggested correction. If no errors are found, state "No errors found." Format the output clearly with headings for each error type:\n\n---\n${text}\n---`
        default:
            throw new Error("Unknown AI action");
    }
}

export const processTextWithAi = async (action: AiAction, text: string, options?: { language?: string }): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API key not found.");
    }
     if (!text || text.trim().length < 10) {
      return "Please enter at least 10 characters to use the AI features.";
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = getPrompt(action, text, options);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error(`Error with AI action "${action}":`, error);
    return "Could not perform AI action. An error occurred. Please check your connection or API key and try again.";
  }
};

// FIX: Add and export missing `getOptimizationTips` function.
export const getOptimizationTips = async (findings: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API key not found.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Based on the following system scan findings, provide 3 actionable and easy-to-understand optimization tips for a non-technical user. Format them as a simple list. Do not include a preamble.

Findings: ${findings}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error(`Error with getOptimizationTips:`, error);
    return "Could not generate optimization tips. An error occurred.";
  }
};
