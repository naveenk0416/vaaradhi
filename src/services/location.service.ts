
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private sampleCities: string[] = [
    'New York, USA', 'San Francisco, USA', 'Dallas, USA',
    'London, UK', 'Manchester, UK',
    'Toronto, Canada', 'Vancouver, Canada',
    'Sydney, Australia', 'Melbourne, Australia',
    'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Hyderabad, India', 'Ahmedabad, India', 'Chennai, India', 'Kolkata, India',
    'Dubai, UAE', 'Singapore', 'Auckland, New Zealand'
  ];

  private sampleCountries: string[] = [
    'USA', 'UK', 'Canada', 'Australia', 'India', 'New Zealand', 'Germany', 'Singapore', 'United Arab Emirates'
  ];

  getCitySuggestions(query: string): Observable<string[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    const filteredCities = this.sampleCities.filter(
      city => city.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate network delay
    return of(filteredCities).pipe(delay(300));
  }

  getCountrySuggestions(query: string): Observable<string[]> {
    if (!query) {
      return of([]);
    }

    const filteredCountries = this.sampleCountries.filter(
      country => country.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate network delay
    return of(filteredCountries).pipe(delay(200));
  }
}
