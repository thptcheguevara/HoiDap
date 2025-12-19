
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize the GoogleGenAI client directly with the API key from environment variables, assuming it's always present as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAnswerSuggestion = async (question: string): Promise<string> => {
  // Fix: Remove manual API key check, as it's assumed to be configured.
  try {
    const prompt = `Based on the following question, provide a helpful and concise answer. Question: "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const text = response.text;
    
    if (text) {
        return text.trim();
    } else {
        return "Không thể tạo câu trả lời. Vui lòng thử lại.";
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get suggestion from Gemini.");
  }
};