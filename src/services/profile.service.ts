
import { Injectable, signal, computed } from '@angular/core';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private allProfiles = signal<Profile[]>([
    {
      id: 6,
      name: 'Aditya',
      email: 'aditya.rao@example.com',
      phone: '+1 (123) 456-7890',
      age: 30,
      imageUrls: ['https://picsum.photos/seed/boy3/600/800', 'https://picsum.photos/seed/boy3a/600/800', 'https://picsum.photos/seed/boy3b/600/800'],
      city: 'New York',
      country: 'USA',
      bio: 'Marketing manager, foodie, and a huge cricket fan. Looking for someone with a great sense of humor.',
      interests: ['Cricket', 'Food', 'Marketing', 'Comedy'],
      verification: { isIdVerified: true, isNriVerified: true, isProfilePictureVerified: true },
      visaStatus: 'Student Visa',
      career: 'Marketing Manager at Spotify',
      education: 'MSc in Marketing, Columbia University',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Telugu',
      height: `6' 0"`,
      dob: '1994-08-15',
      placeOfBirth: 'New York, USA',
      timeOfBirth: '09:30',
      rashi: 'Simha (Leo)',
      nakshatra: 'Magha',
      userCategory: 'NRI',
      preferences: {
        willingToRelocate: false,
        preferredCountries: []
      }
    },
    {
      id: 1,
      name: 'Ananya',
      email: 'ananya.k@example.com',
      phone: '+1 (987) 654-3210',
      age: 28,
      imageUrls: ['https://picsum.photos/seed/girl1/600/800', 'https://picsum.photos/seed/girl1a/600/800', 'https://picsum.photos/seed/girl1b/600/800'],
      city: 'San Francisco',
      country: 'USA',
      bio: 'Software engineer with a love for hiking and classical music. Looking for a meaningful connection.',
      interests: ['Hiking', 'Music', 'Travel', 'Cooking'],
      verification: { isIdVerified: true, isNriVerified: true, isProfilePictureVerified: true },
      visaStatus: 'Work Visa',
      career: 'Software Engineer at Google',
      education: 'MS in Computer Science, Stanford',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Reddy',
      motherTongue: 'Telugu',
      height: `5' 6"`,
      dob: '1996-03-22',
      placeOfBirth: 'San Francisco, USA',
      timeOfBirth: '14:00',
      rashi: 'Meena (Pisces)',
      nakshatra: 'Revati',
      userCategory: 'NRI',
      preferences: {
        willingToRelocate: true,
        preferredCountries: ['USA', 'Canada']
      }
    },
    {
      id: 2,
      name: 'Rohan',
      email: 'rohan.patel@example.co.uk',
      phone: '+44 20 7946 0958',
      age: 31,
      imageUrls: ['https://picsum.photos/seed/boy1/600/800', 'https://picsum.photos/seed/boy1a/600/800', 'https://picsum.photos/seed/boy1b/600/800', 'https://picsum.photos/seed/boy1c/600/800'],
      city: 'London',
      country: 'UK',
      bio: 'Architect who enjoys photography and exploring new cafes. Family-oriented and ambitious.',
      interests: ['Photography', 'Architecture', 'Coffee', 'Movies'],
      verification: { isIdVerified: true, isNriVerified: true, isProfilePictureVerified: false },
      visaStatus: 'Citizen',
      career: 'Lead Architect at Foster + Partners',
      education: 'M.Arch, University of Arts London',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Kamma',
      motherTongue: 'Telugu',
      height: `5' 11"`,
      dob: '1993-01-10',
      placeOfBirth: 'London, UK',
      timeOfBirth: '20:15',
      rashi: 'Makara (Capricorn)',
      nakshatra: 'Shravana',
      userCategory: 'NRI',
      preferences: {
        willingToRelocate: true,
        preferredCountries: ['USA', 'UK']
      }
    },
    {
      id: 3,
      name: 'Priya',
      email: 'priya.singh@example.ca',
      phone: '+1 (416) 555-0123',
      age: 26,
      imageUrls: ['https://picsum.photos/seed/girl2/600/800', 'https://picsum.photos/seed/girl2a/600/800'],
      city: 'Toronto',
      country: 'Canada',
      bio: 'Doctor by profession, artist by heart. I find joy in painting and spending time with my dog.',
      interests: ['Art', 'Animals', 'Reading', 'Yoga'],
      verification: { isIdVerified: false, isNriVerified: true, isProfilePictureVerified: true },
      visaStatus: 'Permanent Resident',
      career: 'Resident Doctor at Toronto General',
      education: 'MD, University of Toronto',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Kapu',
      motherTongue: 'Tamil',
      height: `5' 4"`,
      dob: '1998-11-05',
      placeOfBirth: 'Toronto, Canada',
      timeOfBirth: '03:45',
      rashi: 'Vrishchika (Scorpio)',
      nakshatra: 'Jyeshtha',
      userCategory: 'NRI',
      preferences: {
        willingToRelocate: false,
        preferredCountries: []
      }
    },
    {
      id: 4,
      name: 'Vikram',
      email: 'vikram.reddy@example.com',
      phone: '+1 (214) 555-0199',
      age: 33,
      imageUrls: ['https://picsum.photos/seed/boy2/600/800', 'https://picsum.photos/seed/boy2a/600/800', 'https://picsum.photos/seed/boy2b/600/800'],
      city: 'Dallas',
      country: 'USA',
      bio: 'Entrepreneur in the tech space. Avid reader and fitness enthusiast. Believes in honesty and kindness.',
      interests: ['Business', 'Fitness', 'Reading', 'Tech'],
      verification: { isIdVerified: true, isNriVerified: false, isProfilePictureVerified: true },
      visaStatus: 'Permanent Resident',
      career: 'Founder & CEO of Innovate Inc.',
      education: 'MBA, University of Texas at Austin',
      maritalStatus: 'Divorced',
      religion: 'Hindu',
      caste: 'Velama',
      motherTongue: 'Telugu',
      height: `5' 10"`,
      dob: '1991-06-30',
      placeOfBirth: 'Dallas, USA',
      timeOfBirth: '18:00',
      rashi: 'Karka (Cancer)',
      nakshatra: 'Ashlesha',
      userCategory: 'NRI',
      preferences: {
        willingToRelocate: false,
        preferredCountries: []
      }
    },
    {
      id: 5,
      name: 'Sneha',
      email: 'sneha.jain@example.com.au',
      phone: '+61 2 9999 8888',
      age: 29,
      imageUrls: ['https://picsum.photos/seed/girl3/600/800', 'https://picsum.photos/seed/girl3a/600/800', 'https://picsum.photos/seed/girl3b/600/800'],
      city: 'Sydney',
      country: 'Australia',
      bio: 'Fashion designer who loves to travel and experience different cultures. Searching for a partner in crime.',
      interests: ['Fashion', 'Travel', 'Food', 'Dancing'],
      verification: { isIdVerified: false, isNriVerified: false, isProfilePictureVerified: false },
      visaStatus: 'Work Visa',
      career: 'Fashion Designer at Zimmermann',
      education: 'BA in Fashion Design, RMIT University',
      maritalStatus: 'Never Married',
      religion: 'Jain',
      caste: 'Vaishya',
      motherTongue: 'Gujarati',
      height: `5' 7"`,
      dob: '1995-02-18',
      placeOfBirth: 'Sydney, Australia',
      timeOfBirth: '11:20',
      rashi: 'Kumbha (Aquarius)',
      nakshatra: 'Shatabhisha',
      userCategory: 'NRI',
      preferences: {
        willingToRelocate: true,
        preferredCountries: ['Australia', 'USA', 'New Zealand']
      }
    },
    {
      id: 7,
      name: 'Kavya',
      email: 'kavya.gupta@example.in',
      phone: '+91 22 2345 6789',
      age: 27,
      imageUrls: ['https://picsum.photos/seed/girl4/600/800', 'https://picsum.photos/seed/girl4a/600/800'],
      city: 'Mumbai',
      country: 'India',
      bio: 'A chartered accountant who loves exploring the bustling city life. I enjoy theatre and stand-up comedy.',
      interests: ['Theatre', 'Comedy', 'Finance', 'Street Food'],
      verification: { isIdVerified: true, isNriVerified: false, isProfilePictureVerified: true },
      visaStatus: 'Citizen',
      career: 'Chartered Accountant at Deloitte',
      education: 'CA, Institute of Chartered Accountants of India',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Agarwal',
      motherTongue: 'Hindi',
      height: `5' 5"`,
      dob: '1997-07-07',
      placeOfBirth: 'Mumbai, India',
      timeOfBirth: '07:00',
      rashi: 'Karka (Cancer)',
      nakshatra: 'Punarvasu',
      userCategory: 'INDIA',
      preferences: {
        willingToRelocate: true,
        preferredCountries: ['USA', 'UK']
      }
    },
    {
      id: 8,
      name: 'Arjun',
      email: 'arjun.menon@example.in',
      phone: '+91 80 4567 8901',
      age: 29,
      imageUrls: ['https://picsum.photos/seed/boy4/600/800', 'https://picsum.photos/seed/boy4a/600/800', 'https://picsum.photos/seed/boy4b/600/800'],
      city: 'Bangalore',
      country: 'India',
      bio: 'Data scientist with a passion for gaming and trekking. Looking for an adventurous and intellectual partner.',
      interests: ['Gaming', 'Trekking', 'Data Science', 'Podcasts'],
      verification: { isIdVerified: false, isNriVerified: false, isProfilePictureVerified: true },
      visaStatus: 'Citizen',
      career: 'Data Scientist at Flipkart',
      education: 'M.Tech in AI, IISc Bangalore',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Nair',
      motherTongue: 'Malayalam',
      height: `5' 9"`,
      dob: '1995-09-01',
      placeOfBirth: 'Bangalore, India',
      timeOfBirth: '23:55',
      rashi: 'Simha (Leo)',
      nakshatra: 'Purva Phalguni',
      userCategory: 'INDIA',
      preferences: {
        willingToRelocate: false,
        preferredCountries: []
      }
    },
    {
      id: 9,
      name: 'Riya Sharma',
      email: 'riya.sharma@example.in',
      phone: '+91 11 3456 7890',
      age: 25,
      imageUrls: ['https://picsum.photos/seed/girl5/600/800', 'https://picsum.photos/seed/girl5a/600/800', 'https://picsum.photos/seed/girl5b/600/800'],
      city: 'Delhi',
      country: 'India',
      bio: 'Creative graphic designer with a passion for minimalistic art and modern aesthetics. I love exploring art galleries and reading books.',
      interests: ['Art', 'Design', 'Books', 'Museums'],
      verification: { isIdVerified: true, isNriVerified: false, isProfilePictureVerified: false },
      visaStatus: 'Citizen',
      career: 'Graphic Designer at Zomato',
      education: 'B.Des from National Institute of Design',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Sharma',
      motherTongue: 'Hindi',
      height: `5' 3"`,
      dob: '1999-04-12',
      placeOfBirth: 'Delhi, India',
      timeOfBirth: '12:00',
      rashi: 'Mesha (Aries)',
      nakshatra: 'Bharani',
      userCategory: 'INDIA',
      preferences: {
        willingToRelocate: true,
        preferredCountries: ['Canada', 'Germany']
      }
    },
    {
      id: 10,
      name: 'Sameer Khan',
      email: 'sameer.khan@example.in',
      phone: '+91 40 5678 9012',
      age: 32,
      imageUrls: ['https://picsum.photos/seed/boy5/600/800'],
      city: 'Hyderabad',
      country: 'India',
      bio: 'A passionate chef who believes food is the ultimate way to connect with people. I enjoy experimenting with fusion cuisines and long bike rides.',
      interests: ['Cooking', 'Biking', 'Food', 'Travel'],
      verification: { isIdVerified: false, isNriVerified: false, isProfilePictureVerified: true },
      visaStatus: 'Citizen',
      career: 'Head Chef at Olive Bistro',
      education: 'Diploma in Culinary Arts',
      maritalStatus: 'Never Married',
      religion: 'Muslim',
      caste: 'Khan',
      motherTongue: 'Urdu',
      height: `6' 1"`,
      dob: '1992-12-25',
      placeOfBirth: 'Hyderabad, India',
      timeOfBirth: '06:10',
      rashi: 'Dhanu (Sagittarius)',
      nakshatra: 'Mula',
      userCategory: 'INDIA',
      preferences: {
        willingToRelocate: false,
        preferredCountries: []
      }
    },
    {
      id: 11,
      name: 'Pooja Patel',
      email: 'pooja.patel@example.in',
      phone: '+91 79 6789 0123',
      age: 28,
      imageUrls: ['https://picsum.photos/seed/girl6/600/800', 'https://picsum.photos/seed/girl6a/600/800', 'https://picsum.photos/seed/girl6b/600/800'],
      city: 'Ahmedabad',
      country: 'India',
      bio: 'Architect focused on sustainable and eco-friendly designs. In my free time, you can find me practicing pottery or volunteering for local causes.',
      interests: ['Architecture', 'Pottery', 'Volunteering', 'Sustainability'],
      verification: { isIdVerified: true, isNriVerified: false, isProfilePictureVerified: true },
      visaStatus: 'Citizen',
      career: 'Architect at HCP Design',
      education: 'B.Arch from CEPT University',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Patel',
      motherTongue: 'Gujarati',
      height: `5' 8"`,
      dob: '1996-10-19',
      placeOfBirth: 'Ahmedabad, India',
      timeOfBirth: '15:45',
      rashi: 'Tula (Libra)',
      nakshatra: 'Swati',
      userCategory: 'INDIA',
      preferences: {
        willingToRelocate: true,
        preferredCountries: ['Australia', 'New Zealand']
      }
    }
  ]);
  
  // Let's assume the first profile is our current user
  currentUser = signal<Profile>(this.allProfiles()[0]);
  
  // The rest are profiles to discover
  discoverableProfiles = computed(() => this.allProfiles().slice(1));

  likedProfiles = signal<Profile[]>([]);

  // --- User-facing Methods ---
  
  likeProfile(profile: Profile) {
    this.likedProfiles.update(profiles => {
      if (profiles.some(p => p.id === profile.id)) {
        return profiles;
      }
      return [profile, ...profiles];
    });
  }

  updateCurrentUser(updatedProfile: Profile) {
    this.currentUser.set(updatedProfile);
    this.updateProfileById(updatedProfile.id, updatedProfile);
  }

  // --- Admin Methods ---

  getAllProfiles() {
    return computed(() => this.allProfiles());
  }

  getProfileById(id: number): Profile | undefined {
    return this.allProfiles().find(p => p.id === id);
  }

  createProfile(profileData: Omit<Profile, 'id'>): void {
    this.allProfiles.update(profiles => {
      const newId = Math.max(...profiles.map(p => p.id), 0) + 1;
      const newProfile: Profile = { id: newId, ...profileData };
      return [...profiles, newProfile];
    });
  }

  updateProfileById(id: number, updatedProfileData: Omit<Profile, 'id'>): void {
    this.allProfiles.update(profiles => {
      const index = profiles.findIndex(p => p.id === id);
      if (index !== -1) {
        profiles[index] = { id, ...updatedProfileData };
        
        // If the updated profile is the current user, update that signal too
        if (this.currentUser().id === id) {
          this.currentUser.set(profiles[index]);
        }
      }
      return [...profiles];
    });
  }

  deleteProfile(id: number): void {
    this.allProfiles.update(profiles => profiles.filter(p => p.id !== id));
    this.likedProfiles.update(profiles => profiles.filter(p => p.id !== id));
    // Note: This doesn't handle if the deleted profile is the currentUser. 
    // A real app would need a more robust way to handle that case, e.g., logging out.
  }
}