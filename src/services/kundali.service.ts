
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Profile } from '../models/profile.model';

export interface KundaliMatch {
  score: number;
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class KundaliService {
  private ai: GoogleGenAI;
  private cache = new Map<string, KundaliMatch>();

  constructor() {
    // IMPORTANT: You must have your API key set in the environment.
    // In a real application, this would be handled server-side for security.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  async getMatchScore(userProfile: Profile, otherProfile: Profile): Promise<KundaliMatch> {
    if (!userProfile.rashi || !userProfile.nakshatra || !otherProfile.rashi || !otherProfile.nakshatra) {
      return { score: 0, summary: 'Info Missing' };
    }

    // Create a consistent key for caching, regardless of profile order
    const cacheKey = [userProfile.id, otherProfile.id].sort().join('-');
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const prompt = `
      Based on Vedic astrology principles (Ashta Kuta system), calculate the compatibility score (Guna Milan) out of 36 points for a potential matrimonial match.

      Your response MUST be in a valid JSON format only, with no additional text or markdown.

      Person A (Groom) Details:
      - Rashi (Moon Sign): ${userProfile.rashi}
      - Nakshatra (Birth Star): ${userProfile.nakshatra}
      
      Person B (Bride) Details:
      - Rashi (Moon Sign): ${otherProfile.rashi}
      - Nakshatra (Birth Star): ${otherProfile.nakshatra}
      
      Calculate the Guna Milan score and provide a one-word summary of the match based on the score.
      - Score > 24: "Excellent"
      - Score > 18: "Good"
      - Score <= 18: "Average"
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        score: { 
          type: Type.NUMBER, 
          description: 'The compatibility score out of 36, rounded to the nearest integer.' 
        },
        summary: { 
          type: Type.STRING, 
          description: 'A one-word summary: "Excellent", "Good", or "Average".' 
        }
      },
      required: ['score', 'summary']
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.2
        },
      });
      
      const textResponse = response.text.trim();
      const result: KundaliMatch = JSON.parse(textResponse);
      
      // Ensure score is within bounds
      result.score = Math.max(0, Math.min(36, Math.round(result.score)));
      
      this.cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error("Error getting Kundali match from AI:", error);
      // Fallback to a deterministic simulation on API error
      return this.getSimulatedScore(userProfile, otherProfile, cacheKey);
    }
  }

  // A fallback simulation in case the API fails
  private getSimulatedScore(userProfile: Profile, otherProfile: Profile, cacheKey: string): KundaliMatch {
    const combinedString = userProfile.rashi + userProfile.nakshatra + otherProfile.rashi + otherProfile.nakshatra;
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }

    const score = (Math.abs(hash) % 20) + 17; // Score between 17 and 36

    let summary = 'Average';
    if (score > 24) summary = 'Excellent';
    else if (score > 18) summary = 'Good';

    const result = { score, summary };
    this.cache.set(cacheKey, result);
    return result;
  }
}
