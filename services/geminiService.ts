
import { GoogleGenAI } from "@google/genai";

export async function generateWords(): Promise<string[]> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. The application cannot contact the server to generate words.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    You are a creative assistant for the party game 'Just One'.
    Your task is to generate a list of 5 interesting and guessable words.
    The words must be single, common, concrete nouns that are easy to visualize. Avoid abstract concepts, proper nouns, or obscure words.
    Provide the output as a JSON object with a single key "words" which is an array of 5 strings. Each string should be capitalized.

    Example format:
    {
      "words": ["Telescope", "Symphony", "Pancake", "Illusion", "Vacation"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 1.0,
        },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
        jsonStr = match[1].trim();
    }
    
    const parsed = JSON.parse(jsonStr);

    if (parsed && Array.isArray(parsed.words) && parsed.words.length === 5) {
        return parsed.words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    } else {
        console.error("Invalid format from API:", parsed);
        throw new Error("Received invalid word format from the API.");
    }
  } catch (error) {
    console.error("Error generating words from Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API key is not valid. Please check your configuration.");
    }
    throw new Error("Could not fetch words from the API. This may be a network issue or an API key problem.");
  }
}
