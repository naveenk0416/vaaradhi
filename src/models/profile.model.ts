
export type VisaStatus = 'Citizen' | 'Permanent Resident' | 'Work Visa' | 'Student Visa';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Annulled';
export type UserCategory = 'INDIA' | 'NRI';

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  imageUrls: string[];
  city: string;
  country: string;
  bio: string;
  interests: string[];
  verification: {
    isIdVerified: boolean;
    isNriVerified: boolean;
    isProfilePictureVerified: boolean;
  };
  visaStatus: VisaStatus;
  career: string;
  education: string;
  maritalStatus: MaritalStatus;
  religion: string;
  caste: string;
  motherTongue: string;
  height: string; // e.g., "5' 8\""
  dob: string; // YYYY-MM-DD
  placeOfBirth: string;
  timeOfBirth: string; // HH:MM
  rashi: string;
  nakshatra: string;
  userCategory: UserCategory;
  preferences: {
    willingToRelocate: boolean;
    preferredCountries: string[];
  };
}