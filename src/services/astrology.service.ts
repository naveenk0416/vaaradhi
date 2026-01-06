
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AstrologyService {

  private rashis = [
    'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 
    'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)', 
    'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)', 
    'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
  ];

  private nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  // Simulate an API call to a Vedic astrology service
  async getAstroDetails(dob: string, timeOfBirth: string, placeOfBirth: string): Promise<{ rashi: string; nakshatra: string; }> {
    // In a real app, you'd make an HTTP request here with dob, time, and place of birth.
    // For this simulation, we'll use all inputs to generate a pseudo-random but deterministic result.
    
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // This logic is for simulation purposes and is NOT astrologically accurate.
      // It uses the birth details to derive a seemingly related result.
      const month = new Date(dob).getMonth(); // 0-11
      const day = new Date(dob).getDate();   // 1-31
      // Simple hash from the place of birth string length to make it a factor
      const placeHash = placeOfBirth.length;

      const rashiIndex = (month + placeHash) % this.rashis.length;
      const nakshatraIndex = (day + placeHash) % this.nakshatras.length;

      const rashi = this.rashis[rashiIndex];
      const nakshatra = this.nakshatras[nakshatraIndex];

      return { rashi, nakshatra };
    } catch (e) {
      // Fallback for invalid date or other errors
      return { 
        rashi: this.rashis[0], 
        nakshatra: this.nakshatras[0] 
      };
    }
  }
}
