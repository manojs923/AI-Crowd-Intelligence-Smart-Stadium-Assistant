import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY
});

async function main() {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hello',
    });
    console.log("SUCCESS:", response.text);
  } catch (err) {
    console.error("ERROR:", err);
  }
}
main();
