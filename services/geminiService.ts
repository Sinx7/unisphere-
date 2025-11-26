
import { GoogleGenAI, Type } from '@google/genai';
import { Event } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd show a user-friendly error.
  // For this demo, we assume the key is set in the environment.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getRecommendedEventIds = async (events: Event[], interests: string): Promise<string[]> => {
  if (!API_KEY) {
    console.error("Cannot call Gemini API: API_KEY is missing.");
    return [];
  }

  const model = 'gemini-2.5-flash';

  const eventInfo = events.map(event => ({
    id: event.id,
    name: event.name,
    description: event.description,
  }));

  const prompt = `Based on the user's interests in "${interests}", which of the following events would you recommend? Provide only the event IDs for your recommendations.

Event List:
${JSON.stringify(eventInfo, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedEventIds: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "The ID of a recommended event."
              }
            }
          }
        },
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && Array.isArray(result.recommendedEventIds)) {
      return result.recommendedEventIds;
    }

    return [];
  } catch (error) {
    console.error('Error fetching recommendations from Gemini:', error);
    return [];
  }
};
