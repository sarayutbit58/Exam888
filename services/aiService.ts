import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you'd have a more robust way of handling this,
    // but for this example, we'll throw an error to make it clear.
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are an expert cybersecurity tutor, specializing in the ISC2 Certified in Cybersecurity (CC) certification. 
Your role is to explain complex concepts in a way that is simple, clear, and easy for a beginner to understand.
- Use markdown for formatting (headings, bold text, lists).
- Keep explanations concise but comprehensive.
- Start with a direct definition, then provide a simple analogy or example.
- End with a "Key Takeaway" section summarizing why the concept is important for the exam.`;


export const explainConcept = async (concept: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please explain the concept of: "${concept}"`,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching explanation from Gemini API:", error);
        return "Sorry, I was unable to fetch an explanation at this time. Please check your API key and network connection and try again.";
    }
};
